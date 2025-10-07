# CMakeLists.txt for 16KB page size support
cmake_minimum_required(VERSION 3.22.1)

# Project name
project(ulep_16kb_support)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add linker flags for 16KB page size support
set(CMAKE_SHARED_LINKER_FLAGS "${CMAKE_SHARED_LINKER_FLAGS} -Wl,-z,max-page-size=16384 -Wl,-z,common-page-size=16384")
set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -Wl,-z,max-page-size=16384 -Wl,-z,common-page-size=16384")

# Enable position independent code
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

# Set Android specific configurations
if(ANDROID)
    set(CMAKE_ANDROID_STL_TYPE c++_shared)
    set(CMAKE_ANDROID_ARCH_ABI ${ANDROID_ABI})
endif()
