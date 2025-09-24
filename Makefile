CC = cc
CFLAGS = -O2 -Wall -Wextra -std=c11
LDFLAGS = 

SRC = src/main.c src/linux_spd.c src/smbios_win.c
OBJ = $(SRC:.c=.o)

BIN = spd_dump

all: $(BIN)

$(BIN): $(OBJ)
	$(CC) $(CFLAGS) -DPLATFORM_LINUX -o $@ $^ $(LDFLAGS)

clean:
	rm -f $(OBJ) $(BIN)

.PHONY: all clean

