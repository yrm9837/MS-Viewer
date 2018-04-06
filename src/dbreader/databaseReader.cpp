#include "msReader.hpp"
#include <time.h>

int main(int argc, char* argv[]) {
  if (argc < 3) {
    std::cout << argv[0] << " file.mzML scan_index" << std::endl;
    std::cout << argv[0] << " file.mzML -s ms_level" << std::endl;
    std::cout << argv[0] << " file.mzML -f" << std::endl;
    std::cout << argv[0] << " file.mzML -p mzmin mzmax rtmin rtmax numpoints intmin" << std::endl;
    return EXIT_FAILURE;
  }
  msReader msreader(argv[1]);
  if (strcmp(argv[2],"-s") == 0) {
  	std::cout << "Break1" << std::endl;
    msreader.getScans(std::stoi(argv[3]));
  } else if (strcmp(argv[2],"-p") == 0) {
    clock_t t1 = clock();
    // msreader.getAllPeaks(std::stod(argv[3]), std::stod(argv[4]), std::stod(argv[5]), std::stod(argv[6]), std::stoi(argv[7]), std::stod(argv[8]));
    // msreader.getAllPeaksDB(std::stod(argv[3]), std::stod(argv[4]), std::stod(argv[5]), std::stod(argv[6]), std::stoi(argv[7]), std::stod(argv[8]));
    // msreader.getAllPeaksDBOneTable(std::stod(argv[3]), std::stod(argv[4]), std::stod(argv[5])*60, std::stod(argv[6])*60, std::stoi(argv[7]), std::stod(argv[8]));
    msreader.getAllPeaksDBOneTableRTree(std::stod(argv[3]), std::stod(argv[4]), std::stod(argv[5])*60, std::stod(argv[6])*60, std::stoi(argv[7]), std::stod(argv[8]));
    // std::cout <<"Use Time: "<< (clock() - t1) * 1.0 / CLOCKS_PER_SEC << std::endl;
  } else if (strcmp(argv[2],"-f") == 0) {
    clock_t t1 = clock();
    // msreader.getRange();
    // msreader.getRangeDB();
    msreader.getRangeDBOneTable();
    // std::cout <<"Use Time: "<< (clock() - t1) * 1.0 / CLOCKS_PER_SEC << std::endl;
  } else if (strcmp(argv[2],"-c") == 0) {
    clock_t t1 = clock();
    // msreader.createDtabase();
    // msreader.createDtabaseOneTable();
    msreader.createDtabaseOneTableRTree();
    std::cout <<"Use Time: "<< (clock() - t1) * 1.0 / CLOCKS_PER_SEC << std::endl;
  } else if (strcmp(argv[2],"-t") == 0) {
  } else if (strcmp(argv[2],"-n2s") == 0) {
    std::cout << int2str(std::stoi(argv[3])) << std::endl;
  } else {
    msreader.getSinglePeaks(std::stoi(argv[2]));
  }
  
  return EXIT_SUCCESS;
}