#Specify the version being used as well as the language
cmake_minimum_required(VERSION 3.1)
#Name your project here
project(msReader)

SET(EXECUTABLE_OUTPUT_PATH ${PROJECT_BINARY_DIR}/../bin)

IF(${CMAKE_SYSTEM_NAME} MATCHES "Linux")
  # Linux specific code
  include_directories(${CMAKE_CURRENT_SOURCE_DIR}/src
                      /usr/include/libpwiz
                      /usr/include/libpwiz/libraries/boost_aux)
ENDIF(${CMAKE_SYSTEM_NAME} MATCHES "Linux") 

file(GLOB READER_SRCS ${CMAKE_CURRENT_SOURCE_DIR}/src/msdata/*.cpp)

add_executable(msReader ${READER_SRCS})

IF(${CMAKE_SYSTEM_NAME} MATCHES "Linux")
    target_link_libraries(msReader boost_filesystem boost_system pwiz)
ENDIF(${CMAKE_SYSTEM_NAME} MATCHES "Linux") 

