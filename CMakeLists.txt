cmake_minimum_required(VERSION 3.10)
project(spd_dump C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

if(WIN32)
  add_definitions(-DPLATFORM_WINDOWS)
else()
  add_definitions(-DPLATFORM_LINUX)
endif()

add_executable(spd_dump
  src/main.c
  src/linux_spd.c
  src/smbios_win.c
)

if(WIN32)
  target_link_libraries(spd_dump PRIVATE kernel32)
endif()

