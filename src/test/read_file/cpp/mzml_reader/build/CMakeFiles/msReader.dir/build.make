# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.5

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Remove some rules from gmake that .SUFFIXES does not remove.
SUFFIXES =

.SUFFIXES: .hpux_make_needs_suffix_list


# Suppress display of executed commands.
$(VERBOSE).SILENT:


# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/bin/cmake

# The command to remove a file.
RM = /usr/bin/cmake -E remove -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /home/yangrun/Documents/js_project/spectra_visualization/src/test/read_file/cpp/mzml_reader

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /home/yangrun/Documents/js_project/spectra_visualization/src/test/read_file/cpp/mzml_reader/build

# Include any dependencies generated for this target.
include CMakeFiles/msReader.dir/depend.make

# Include the progress variables for this target.
include CMakeFiles/msReader.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/msReader.dir/flags.make

CMakeFiles/msReader.dir/src/msdata/Test.cpp.o: CMakeFiles/msReader.dir/flags.make
CMakeFiles/msReader.dir/src/msdata/Test.cpp.o: ../src/msdata/Test.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/yangrun/Documents/js_project/spectra_visualization/src/test/read_file/cpp/mzml_reader/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object CMakeFiles/msReader.dir/src/msdata/Test.cpp.o"
	/usr/bin/c++   $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/msReader.dir/src/msdata/Test.cpp.o -c /home/yangrun/Documents/js_project/spectra_visualization/src/test/read_file/cpp/mzml_reader/src/msdata/Test.cpp

CMakeFiles/msReader.dir/src/msdata/Test.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/msReader.dir/src/msdata/Test.cpp.i"
	/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/yangrun/Documents/js_project/spectra_visualization/src/test/read_file/cpp/mzml_reader/src/msdata/Test.cpp > CMakeFiles/msReader.dir/src/msdata/Test.cpp.i

CMakeFiles/msReader.dir/src/msdata/Test.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/msReader.dir/src/msdata/Test.cpp.s"
	/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/yangrun/Documents/js_project/spectra_visualization/src/test/read_file/cpp/mzml_reader/src/msdata/Test.cpp -o CMakeFiles/msReader.dir/src/msdata/Test.cpp.s

CMakeFiles/msReader.dir/src/msdata/Test.cpp.o.requires:

.PHONY : CMakeFiles/msReader.dir/src/msdata/Test.cpp.o.requires

CMakeFiles/msReader.dir/src/msdata/Test.cpp.o.provides: CMakeFiles/msReader.dir/src/msdata/Test.cpp.o.requires
	$(MAKE) -f CMakeFiles/msReader.dir/build.make CMakeFiles/msReader.dir/src/msdata/Test.cpp.o.provides.build
.PHONY : CMakeFiles/msReader.dir/src/msdata/Test.cpp.o.provides

CMakeFiles/msReader.dir/src/msdata/Test.cpp.o.provides.build: CMakeFiles/msReader.dir/src/msdata/Test.cpp.o


# Object files for target msReader
msReader_OBJECTS = \
"CMakeFiles/msReader.dir/src/msdata/Test.cpp.o"

# External object files for target msReader
msReader_EXTERNAL_OBJECTS =

../bin/msReader: CMakeFiles/msReader.dir/src/msdata/Test.cpp.o
../bin/msReader: CMakeFiles/msReader.dir/build.make
../bin/msReader: CMakeFiles/msReader.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/home/yangrun/Documents/js_project/spectra_visualization/src/test/read_file/cpp/mzml_reader/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Linking CXX executable ../bin/msReader"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/msReader.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/msReader.dir/build: ../bin/msReader

.PHONY : CMakeFiles/msReader.dir/build

CMakeFiles/msReader.dir/requires: CMakeFiles/msReader.dir/src/msdata/Test.cpp.o.requires

.PHONY : CMakeFiles/msReader.dir/requires

CMakeFiles/msReader.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/msReader.dir/cmake_clean.cmake
.PHONY : CMakeFiles/msReader.dir/clean

CMakeFiles/msReader.dir/depend:
	cd /home/yangrun/Documents/js_project/spectra_visualization/src/test/read_file/cpp/mzml_reader/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/yangrun/Documents/js_project/spectra_visualization/src/test/read_file/cpp/mzml_reader /home/yangrun/Documents/js_project/spectra_visualization/src/test/read_file/cpp/mzml_reader /home/yangrun/Documents/js_project/spectra_visualization/src/test/read_file/cpp/mzml_reader/build /home/yangrun/Documents/js_project/spectra_visualization/src/test/read_file/cpp/mzml_reader/build /home/yangrun/Documents/js_project/spectra_visualization/src/test/read_file/cpp/mzml_reader/build/CMakeFiles/msReader.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/msReader.dir/depend
