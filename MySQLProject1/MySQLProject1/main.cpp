#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>

#include "mysql_connection.h"
#include <cppconn/driver.h>
#include <cppconn/exception.h>
#include <cppconn/prepared_statement.h>

using namespace std;

//for demonstration only. never save your password in the code!
const string server = "database-1.ctsyx53xzpbn.us-east-2.rds.amazonaws.com:3306";
const string username = "admin";
const string password = "wjamison";

int main()
{
    sql::Driver* driver;
    sql::Connection* con;
    sql::PreparedStatement* pstmt;

    try
    {
        driver = get_driver_instance();
        con = driver->connect(server, username, password);
    }
    catch (sql::SQLException e)
    {
        cout << "Could not connect to server. Error message: " << e.what() << endl;
        system("pause");
        exit(1);
    }

    try
    {
        con->setSchema("tableplus");

        // Open the CSV file
        ifstream file("data.csv");

        // Check if the file is open
        if (!file.is_open())
        {
            cout << "Failed to open the CSV file" << endl;
            exit(1);
        }

        // Read the CSV file line by line
        string line;
        while (getline(file, line))
        {
            // Split the line into fields using ',' as delimiter
            stringstream ss(line);
            vector<string> fields;
            string field;
            while (getline(ss, field, ','))
            {
                fields.push_back(field);
            }

            // Create a prepared statement to insert the data into the database, this could be a a feature to add new data in the future , the ? represents the value of the database varibales
            pstmt = con->prepareStatement("INSERT INTO library_assets(`TAMU_id`, `serial_number`, `manufacturer`, `model`, `mac_address`, `ip_address`, `host_name`, `room_number`, `description`, `pc_number`, `alma_notes`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            for (int i = 0; i < fields.size(); i++)
            {
                // Set the parameters for the prepared statement
                pstmt->setString(i + 1, fields[i]);
            }

            // Execute the prepared statement
            pstmt->execute();

            // Clean up the prepared statement
            delete pstmt;
        }

        cout << "CSV data inserted into the database." << endl;
    }
    catch (sql::SQLException e)
    {
        cout << "SQL Exception: " << e.what() << endl;
        exit(1);
    }

    // Clean up the connection
    delete con;

    return 0;
}
