
// g++ --std=c++11 -I/usr/include/libpwiz spec_list_mzml.cpp -lpwiz

#include <iostream>
#include <memory>
#include <cmath>
#include <string>
#include <fstream>
#include <vector>

#include <pwiz/data/msdata/SpectrumList_mzML.hpp>

using namespace pwiz::msdata;

int main(int argc, char* argv[]) {
  if (argc < 3) {
    std::cout << argv[0] << " file.mzML scan_index" << std::endl;
    return EXIT_FAILURE;
  }

  std::cout << "file: " << argv[1] << std::endl;
  std::cout << "scan index: " << argv[2] << std::endl;

  int scan = std::stoi(argv[2]);

  pwiz::msdata::MSData test_msdata;

  boost::shared_ptr<std::istream> is(new std::ifstream(argv[1]));

  Index_mzML_Ptr index(new Index_mzML(is, test_msdata));

  SpectrumListPtr sl = SpectrumList_mzML::create(is, test_msdata, index);

  SpectrumPtr s = sl->spectrum(scan, true);

  std::cout << "ID: " << s->id << std::endl;

  std::cout << "MS level: " << s->cvParam(MS_ms_level).valueAs<int>() << std::endl;

  std::vector<MZIntensityPair> pairs;

  s->getMZIntensityPairs(pairs);

  std::cout << "Number of peaks: " << pairs.size() << std::endl;

  std::cout << "Peak 42: (" << pairs[42].mz << ", " << pairs[42].intensity << ") "<< std::endl;
  
  return EXIT_SUCCESS;
}
