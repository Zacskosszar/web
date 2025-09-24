#ifdef PLATFORM_LINUX

#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/ioctl.h>
#include <linux/i2c-dev.h>
#include <i2c/smbus.h>

static int open_bus(int bus_number) {
	char path[64];
	snprintf(path, sizeof(path), "/dev/i2c-%d", bus_number);
	int fd = open(path, O_RDWR);
	if (fd < 0) {
		perror("open i2c bus");
		return -1;
	}
	return fd;
}

int linux_read_spd(int bus_number, int address7, int start_offset, uint8_t *out_buffer, int length) {
	if (out_buffer == NULL || length <= 0) return -1;
	int fd = open_bus(bus_number);
	if (fd < 0) return -1;
	if (ioctl(fd, I2C_SLAVE, address7) < 0) {
		perror("I2C_SLAVE ioctl");
		close(fd);
		return -1;
	}
	for (int i = 0; i < length; ++i) {
		int offset = start_offset + i;
		int value = i2c_smbus_read_byte_data(fd, offset & 0xFF);
		if (value < 0) {
			perror("i2c_smbus_read_byte_data");
			close(fd);
			return -1;
		}
		out_buffer[i] = (uint8_t)value;
	}
	close(fd);
	return 0;
}

int linux_spd_scan_bus(int bus_number, int *out_addresses, int max_addresses, int *out_count) {
	if (out_addresses == NULL || out_count == NULL || max_addresses <= 0) return -1;
	*out_count = 0;
	int fd = open_bus(bus_number);
	if (fd < 0) return -1;
	for (int addr = 0x50; addr <= 0x57; ++addr) {
		if (ioctl(fd, I2C_SLAVE, addr) < 0) continue;
		int value = i2c_smbus_read_byte_data(fd, 0);
		if (value >= 0) {
			if (*out_count < max_addresses) {
				out_addresses[*out_count] = addr;
				(*out_count)++;
			}
		}
	}
	close(fd);
	return 0;
}

#endif // PLATFORM_LINUX

