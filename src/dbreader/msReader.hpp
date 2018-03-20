#ifndef MSREADER_HPP_
#define MSREADER_HPP_


#include <iostream>
#include <memory>
#include <cmath>
#include <string>
#include <fstream>
#include <vector>
#include "mzMLReader.hpp" 

#include <pwiz/data/msdata/SpectrumList_mzML.hpp>
#include <pwiz/utility/misc/Std.hpp>

using namespace pwiz::msdata;
// using namespace std;

bool cmpPoints(Point p1, Point p2);
std::string getScan(std::string id);

class msReader
{
public:
	msReader(std::string filename);
	std::string file_name;
  pwiz::msdata::MSData test_msdata;
  boost::shared_ptr<std::istream> is;
  Index_mzML_Ptr index;
	SpectrumListPtr sl;
	mzMLReader databaseReader;
	void getScans(int scanLevel);
	void getSinglePeaks(int scan);
	void getRange();
	void getAllPeaks(double mzmin, double mzmax, double rtmin, double rtmax, int numpoints, double intmin);
	void createDtabase();
	void createDtabase_1();
	void createDtabase_2();
	void createDtabase_3();
	void getRangeDB();
	void getAllPeaksDB(double mzmin, double mzmax, double rtmin, double rtmax, int numpoints, double intmin);
};


#endif
