#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

#ifdef PLATFORM_LINUX
#include "linux_spd.h"
#endif

#ifdef PLATFORM_WINDOWS
#include "smbios_win.h"
#endif

typedef struct CommandLineOptions {
	int i2cBusNumber;
	int i2cAddress;
	int readLength;
	int scanOnly;
} CommandLineOptions;

static void print_usage(const char *program_name) {
	printf("Usage: %s [--bus N] [--addr 0x50] [--len 256] [--scan]\n", program_name);
	printf("\n");
	printf("Examples:\n");
	printf("  %s --bus 0 --addr 0x50 --len 256\n", program_name);
	printf("  %s --scan --bus 0\n", program_name);
	printf("\n");
	printf("Notes:\n");
	printf("- Linux: reads SPD over /dev/i2c-<bus> using i2c-dev. Root or i2c group required.\n");
	printf("- Windows: direct SMBus requires a driver. This tool falls back to SMBIOS to show DIMM info.\n");
}

static int parse_int(const char *text) {
	if (text == NULL) return -1;
	char *end = NULL;
	long value = strtol(text, &end, 0);
	if (end == text || *end != '\0') return -1;
	if (value < 0 || value > 0xFFFF) return -1;
	return (int)value;
}

static int parse_args(int argc, char **argv, CommandLineOptions *out) {
	CommandLineOptions options;
	options.i2cBusNumber = 0;
	options.i2cAddress = 0x50;
	options.readLength = 256;
	options.scanOnly = 0;

	for (int i = 1; i < argc; ++i) {
		if (strcmp(argv[i], "--bus") == 0 && i + 1 < argc) {
			int v = parse_int(argv[++i]);
			if (v < 0) { fprintf(stderr, "Invalid --bus value\n"); return -1; }
			options.i2cBusNumber = v;
		} else if (strcmp(argv[i], "--addr") == 0 && i + 1 < argc) {
			int v = parse_int(argv[++i]);
			if (v < 0 || v > 0x7F) { fprintf(stderr, "Invalid --addr value\n"); return -1; }
			options.i2cAddress = v;
		} else if (strcmp(argv[i], "--len") == 0 && i + 1 < argc) {
			int v = parse_int(argv[++i]);
			if (v <= 0 || v > 512) { fprintf(stderr, "Invalid --len value (1..512)\n"); return -1; }
			options.readLength = v;
		} else if (strcmp(argv[i], "--scan") == 0) {
			options.scanOnly = 1;
		} else if (strcmp(argv[i], "--help") == 0 || strcmp(argv[i], "-h") == 0) {
			print_usage(argv[0]);
			return 1; // signal help printed
		} else {
			fprintf(stderr, "Unknown argument: %s\n", argv[i]);
			print_usage(argv[0]);
			return -1;
		}
	}
	*out = options;
	return 0;
}

static void print_hex(const uint8_t *data, int length) {
	for (int i = 0; i < length; ++i) {
		if (i % 16 == 0) printf("%04X: ", i);
		printf("%02X ", data[i]);
		if ((i % 16) == 15 || i == length - 1) printf("\n");
	}
}

int main(int argc, char **argv) {
	CommandLineOptions options;
	int parse_result = parse_args(argc, argv, &options);
	if (parse_result != 0) {
		return parse_result < 0 ? 1 : 0;
	}

#ifdef PLATFORM_LINUX
	if (options.scanOnly) {
		int found[8];
		int num_found = 0;
		int rc = linux_spd_scan_bus(options.i2cBusNumber, found, 8, &num_found);
		if (rc != 0) {
			fprintf(stderr, "Scan failed (bus %d). Are you root/in i2c group?\n", options.i2cBusNumber);
			return 1;
		}
		printf("Found potential SPD EEPROMs on bus %d at:", options.i2cBusNumber);
		for (int i = 0; i < num_found; ++i) printf(" 0x%02X", found[i]);
		printf("\n");
		return 0;
	}

	uint8_t *buffer = (uint8_t*)malloc((size_t)options.readLength);
	if (!buffer) { fprintf(stderr, "Allocation failed\n"); return 1; }
	memset(buffer, 0, (size_t)options.readLength);

	int rc = linux_read_spd(options.i2cBusNumber, options.i2cAddress, 0, buffer, options.readLength);
	if (rc != 0) {
		fprintf(stderr, "Failed to read SPD from /dev/i2c-%d addr 0x%02X\n", options.i2cBusNumber, options.i2cAddress);
		free(buffer);
		return 1;
	}
	print_hex(buffer, options.readLength);
	free(buffer);
	return 0;
#elif defined(PLATFORM_WINDOWS)
	(void)options; // unused
	return smbios_print_memory_devices_summary();
#else
	fprintf(stderr, "Unsupported platform.\n");
	return 2;
#endif
}

