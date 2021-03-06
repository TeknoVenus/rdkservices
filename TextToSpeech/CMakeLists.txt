set(PLUGIN_NAME TextToSpeech)
set(MODULE_NAME ${NAMESPACE}${PLUGIN_NAME})

find_package(${NAMESPACE}Plugins REQUIRED)

#if(BUILD_TESTS)
    add_subdirectory(test)
#endif()

add_library(${MODULE_NAME} SHARED
        TextToSpeech.cpp
        Module.cpp
        impl/TTSManager.cpp
        impl/TTSSession.cpp
        impl/TTSSpeaker.cpp
        impl/logger.cpp
        )
set_target_properties(${MODULE_NAME} PROPERTIES
        CXX_STANDARD 11
        CXX_STANDARD_REQUIRED YES)

list(APPEND CMAKE_MODULE_PATH
        "${CMAKE_CURRENT_SOURCE_DIR}/cmake/")

find_program(PKG_CONFIG_EXECUTABLE NAMES pkg-config DOC "pkg-config executable")
execute_process(COMMAND ${PKG_CONFIG_EXECUTABLE} gstreamer-1.0 --cflags OUTPUT_VARIABLE GSTREAMER_CFLAGS OUTPUT_STRIP_TRAILING_WHITESPACE)
execute_process(COMMAND ${PKG_CONFIG_EXECUTABLE} gstreamer-1.0 --libs OUTPUT_VARIABLE GSTREAMER_LDLAGS OUTPUT_STRIP_TRAILING_WHITESPACE)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${GSTREAMER_CFLAGS}")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${GSTREAMER_LDLAGS}")

add_definitions (-DUSE_GST1)
add_definitions (-DBCM_NEXUS)

find_package(Curl)
find_package(GLIB REQUIRED)
find_package(IARMBus)

target_include_directories(${MODULE_NAME} PRIVATE ${GLIB_INCLUDE_DIRS} ${IARMBUS_INCLUDE_DIRS} ../helpers)
target_link_libraries(${MODULE_NAME} PRIVATE ${NAMESPACE}Plugins::${NAMESPACE}Plugins ${CURL_LIBRARY} ${GLIB_LIBRARIES} ${IARMBUS_LIBRARIES})

install(TARGETS ${MODULE_NAME}
        DESTINATION lib/${STORAGE_DIRECTORY}/plugins)

write_config(${PLUGIN_NAME})
