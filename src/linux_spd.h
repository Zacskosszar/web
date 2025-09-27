#pragma once

#include <stdint.h>

int linux_read_spd(int bus_number, int address7, int start_offset, uint8_t *out_buffer, int length);

int linux_spd_scan_bus(int bus_number, int *out_addresses, int max_addresses, int *out_count);

