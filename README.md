## spd_dump

Cross-platform C utility to read RAM SPD (JEDEC) data.

- Linux: Reads SPD over I2C using `i2c-dev`/SMBus interface from `/dev/i2c-<bus>`.
- Windows: User-mode direct I2C is not generally available without a driver. The tool falls back to SMBIOS to display memory device information.

### Build

Linux (Make):

```bash
make
```

Linux (CMake):

```bash
cmake -S . -B build && cmake --build build -j
```

Windows (CMake + MSVC):

```bash
cmake -S . -B build -G "Visual Studio 17 2022" && cmake --build build --config Release
```

### Usage

```bash
./spd_dump --help
Usage: ./spd_dump [--bus N] [--addr 0x50] [--len 256] [--scan]
```

- `--bus N`: I2C bus number (Linux). Example: `/dev/i2c-0` → `--bus 0`.
- `--addr 0x50`: 7-bit I2C address (typical SPD addresses: 0x50–0x57).
- `--len 256`: Number of bytes to read from SPD (commonly 256 for DDR3/DDR4, 512 for DDR5 with page switching not yet implemented).
- `--scan`: Scan addresses 0x50–0x57 on the selected bus and list responsive devices.

Examples:

```bash
sudo ./spd_dump --bus 0 --addr 0x50 --len 256
sudo ./spd_dump --scan --bus 1
```

### Requirements and permissions (Linux)

- Kernel I2C support enabled and `i2c-dev` module loaded: `sudo modprobe i2c-dev`.
- User must be root or in the `i2c` group to access `/dev/i2c-*`.
- On some systems you may need to enable the hardware I2C controller in firmware/BIOS.

### Windows notes

- Reading SPD over SMBus in user-mode requires a vendor/third-party driver. This program instead uses SMBIOS to report module size, speed, locator, manufacturer, serial and part number.
- Build with CMake/Visual Studio as shown above and run the produced executable.

### Limitations

- DDR5 SPD often spans 512 bytes and may require page selection via MUX; this simple utility reads a single 0–255 page only on Linux.
- On Windows, raw SPD bytes are not read; SMBIOS is a best-effort summary.

