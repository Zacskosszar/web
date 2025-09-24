#ifdef PLATFORM_WINDOWS

#include <windows.h>
#include <stdio.h>
#include <stdint.h>

typedef struct RawSMBIOSData {
	BYTE Used20CallingMethod;
	BYTE SMBIOSMajorVersion;
	BYTE SMBIOSMinorVersion;
	BYTE DmiRevision;
	DWORD Length;
	BYTE SMBIOSTableData[1];
} RawSMBIOSData;

typedef struct SMBIOSHeader {
	BYTE Type;
	BYTE Length;
	WORD Handle;
} SMBIOSHeader;

static const char* get_string(const SMBIOSHeader *hdr, int index) {
	if (index == 0) return "";
	const BYTE *strings = ((const BYTE*)hdr) + hdr->Length;
	int current = 1;
	while (strings[0] != 0 || strings[1] != 0) {
		if (current == index) return (const char*)strings;
		while (*strings) ++strings;
		++strings; // skip NUL
		++current;
	}
	return "";
}

static const BYTE* next_structure(const SMBIOSHeader *hdr) {
	const BYTE *p = ((const BYTE*)hdr) + hdr->Length;
	// skip strings until double NUL
	while (p[0] != 0 || p[1] != 0) {
		while (*p) ++p;
		++p;
	}
	p += 2; // skip double NUL
	return p;
}

int smbios_print_memory_devices_summary(void) {
	UINT32 provider = 'BMSR'; // 'RSMB' in little-endian
	UINT32 id = 0;
	UINT32 size = GetSystemFirmwareTable(provider, id, NULL, 0);
	if (size == 0) {
		fprintf(stderr, "GetSystemFirmwareTable size failed (err %lu)\n", GetLastError());
		return 1;
	}
	RawSMBIOSData *raw = (RawSMBIOSData*)malloc(size);
	if (!raw) { fprintf(stderr, "Allocation failed\n"); return 1; }
	UINT32 got = GetSystemFirmwareTable(provider, id, raw, size);
	if (got != size) {
		fprintf(stderr, "GetSystemFirmwareTable read failed (err %lu)\n", GetLastError());
		free(raw);
		return 1;
	}
	const BYTE *p = raw->SMBIOSTableData;
	const BYTE *end = raw->SMBIOSTableData + raw->Length;
	printf("SMBIOS %u.%u, DMI %u, TableLen %u\n", raw->SMBIOSMajorVersion, raw->SMBIOSMinorVersion, raw->DmiRevision, raw->Length);
	while (p + sizeof(SMBIOSHeader) <= end) {
		const SMBIOSHeader *hdr = (const SMBIOSHeader*)p;
		if (hdr->Type == 17 && hdr->Length >= 0x15) {
			// Memory Device
			const BYTE *d = p;
			WORD sizeMiB = *(const WORD*)(d + 0x0C);
			BYTE formFactor = *(const BYTE*)(d + 0x0E);
			BYTE locatorStr = *(const BYTE*)(d + 0x10);
			BYTE bankLocatorStr = *(const BYTE*)(d + 0x11);
			BYTE manufacturerStr = *(const BYTE*)(d + 0x17);
			BYTE serialStr = *(const BYTE*)(d + 0x18);
			BYTE partNumberStr = *(const BYTE*)(d + 0x1A);
			WORD configuredSpeed = 0;
			if (hdr->Length >= 0x1C) configuredSpeed = *(const WORD*)(d + 0x1C);
			const char *locator = get_string(hdr, locatorStr);
			const char *bank = get_string(hdr, bankLocatorStr);
			const char *mfg = get_string(hdr, manufacturerStr);
			const char *serial = get_string(hdr, serialStr);
			const char *part = get_string(hdr, partNumberStr);
			unsigned long long sizeBytes = 0ULL;
			if (sizeMiB != 0 && sizeMiB != 0xFFFF) sizeBytes = (unsigned long long)sizeMiB * 1024ULL * 1024ULL;
			printf("Slot=%s Bank=%s Size=%llu bytes Speed=%u MT/s Mfg=%s Part=%s Serial=%s\n",
				locator, bank, sizeBytes, (unsigned)configuredSpeed, mfg, part, serial);
		}
		p = next_structure(hdr);
		if (p <= (const BYTE*)hdr) break; // safety
	}
	free(raw);
	return 0;
}

#endif // PLATFORM_WINDOWS

