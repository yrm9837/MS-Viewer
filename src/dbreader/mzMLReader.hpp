#ifndef MZMLREADER_HPP_
#define MZMLREADER_HPP_


#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <sqlite3.h> 
using namespace std;

struct Point{
  double mz;
  double rt;
  double inten;
};

int callback(void *NotUsed, int argc, char **argv, char **azColName);
std::string num2str(double num);
std::string int2str(int num);
class mzMLReader
{
public:
	std::string databaseName;
	sqlite3 *db;
	char *zErrMsg = 0;
	int  rc;
	char *sql;
	char *data;
	bool isNew;
	sqlite3_stmt *stmtSp;
	sqlite3_stmt *stmtPeak;
	mzMLReader();
	void setName(std::string fileName);
	void openDatabase(std::string fileName);
	void closeDatabase();
	void creatTable();
	void insertSp(int scanIndex, std::string scan, double retentionTime);
	void insertPeak(int peakIndex, int scanIndex, double intensity, double mz);
	void getRange();
	void getPeaks(double mzmin, double mzmax, double rtmin, double rtmax, int numpoints, double intmin);
	void beginTransaction();
	void endTransaction();
	void synchronous();
	void openInsertStmt();
	void closeInsertStmt();
	void insertSpStmt(int scanIndex, std::string scan, double retentionTime);
	void insertPeakStmt(int peakIndex, int scanIndex, double intensity, double mz);
};


#endif