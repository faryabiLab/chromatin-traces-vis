

## Project abstract

This is a web application to visualize chromatin traces and provide interactive features which can be accessed at https://faryabilab.github.io/chromatin-traces-vis/ 

<img width="1999" alt="image" src="https://github.com/user-attachments/assets/a743fa08-9045-4988-bcde-9df53f5d2485" />

<img width="2062" alt="image" src="https://github.com/user-attachments/assets/1ec10746-75e6-4f0b-9daf-51711fdfe6c6" />


## 🚀 Getting Started

### What You Can Do

-   View and browse your chromatin traces as 3D models
-   Inspect the distance between readouts easily
-   Inspect the perimeter of any three readouts
-   Filter linkage with a given distance threshold
-   Distance heatmap
-   Distance to the geometric center
-   Radius of Gyration

## 📁 Supported File Types

### Input Formats

Please ensure your CSV file contains the following required columns (case-insensitive):

- Either **fov, s, readout, x, y, z**
- Or **fov, trace, readout, x, y, z**

extra columns are ignored

### Sample Data
Click to download an example CSV file: [sample.csv](https://github.com/user-attachments/files/20494724/sample.csv)

#### Sample data details
The sample dataset include three field of views (FOV):
- FOV1: one allele with no missing values
- FOV2: five alleles with no missing values
- FOV3: one allele WITH missing values

### Data pre-process

This program is using linear interpolation to impute the missing values.

<img width="2023" alt="image" src="https://github.com/user-attachments/assets/9a788284-cf77-404a-9b95-a7739a2aedcd" />


## 📋 How to Use

### Step 1: Upload Your CSV File

1.   Click the button to start uploading. ![Frame 15](https://github.com/user-attachments/assets/9445d938-a7a5-4154-a4bc-9950ab0c7493)

2.   Enter the number of Total Readouts. **This step is required** in order to fill in all the missing values. All the alleles will have this number of total readouts. ![Frame 2](https://github.com/user-attachments/assets/1c375384-c032-4dd4-ba2a-4be650d29687)


3.   Drop your CSV file or click to upload. Your file **WILL NOT** be saved to our database.<img width="1799" alt="image" src="https://github.com/user-attachments/assets/26a864b4-0a14-4499-b4c4-aedb98cd06e0" />


4.   Click the button to view your traces. <img width="1913" alt="image" src="https://github.com/user-attachments/assets/0f170634-fd7d-4b57-9856-7964aab4338f" />


### OR: Browse the files stored in our database

1.   Use the shortcuts to view available chromatin traces. ![Frame 1](https://github.com/user-attachments/assets/8d4fc776-13d8-4089-89e9-ba1e9048af47)

2.   You can fill the form to submit metadata to us. ![Frame 4](https://github.com/user-attachments/assets/acf361ef-d8c7-420b-9050-46eeaf4085c5)

3.   Keyword is pre-set for your convenience. You can clear the search bar to view the whole database. <img width="2050" alt="image" src="https://github.com/user-attachments/assets/72e95d50-d3d5-4d87-815d-18e32b4a01d2" />

4.   Use column filter. ![Frame 6](https://github.com/user-attachments/assets/eb02c96b-4988-474f-8c21-235cb76a0952)

5.   Inspect metadata. ![Frame 5](https://github.com/user-attachments/assets/fc72be7e-2ce7-4487-a331-e1a62108d477)

6.   Click view. ![Frame 14](https://github.com/user-attachments/assets/4f25d223-4b9c-4ef1-a01f-4517003fdaa2)


### Step 2: Visualization Analysis

#### Basic
1.   Select FOV and Allele to view any trace. <img width="775" alt="image" src="https://github.com/user-attachments/assets/aba0e634-d1b2-4a8b-95a8-9e45436619c1" />

2.   Use GUI to adjust
     1.   Color
     2.   Toggle Grid and axis
     3.   Line Size
     4.   Dot Size
     5.   Toggle the distance label of a selected linkage
     6.   Click Reset to clear all the selection of the dots. <img width="987" alt="image" src="https://github.com/user-attachments/assets/c52fa03e-5d2d-4591-b31d-4d60f31458c1" />
#### Distance Analysis
1.   Select any of the three options. <img width="2106" alt="Google Chrome 2025-06-12 14 54 04" src="https://github.com/user-attachments/assets/068bbcd5-ab28-4e8c-b8ca-82548d9095b5" />
2.   Filter readouts within a radius. <img width="1893" alt="image" src="https://github.com/user-attachments/assets/ab7ebb21-3e67-4d1d-8df4-1527673cd0e6" />
3.   Calculate pairwise distance
       1.  Click any two dots to view the distance. <img width="991" alt="image" src="https://github.com/user-attachments/assets/6f3ab74a-94af-4d71-854d-e55686fd8d40" />
       2.  Filter alleles within the current fov with a maximum distance between two selected readouts. <img width="2025" alt="image" src="https://github.com/user-attachments/assets/9e40723c-f226-4ef4-8cf6-92ccbdd53851" />
4.   Calculate 3-way perimeter. <img width="1496" alt="image" src="https://github.com/user-attachments/assets/107c5eb4-5dcb-44a5-a657-c3995adfbdc4" />


####   Distance Heatmap

1.   Click any grid cell to view the linkage in the 3D model. <img width="2067" alt="image" src="https://github.com/user-attachments/assets/8cd0cabd-80da-483d-9c66-5408753a0e2b" />

2.   Use the filter to filter the linkage distances that are within the range. <img width="698" alt="image" src="https://github.com/user-attachments/assets/a7bcb08d-ab24-4a39-b2dc-5db149142a01" />

#### Centrality Profile

1.   Hover to view the distance to the geometric center. <img width="2059" alt="image" src="https://github.com/user-attachments/assets/1f78b433-c621-45ac-8463-c94da9506c6a" />

2.   Click to download PDF

#### Radius of Gyration

1.   Radius of Gyration. <img width="2064" alt="image" src="https://github.com/user-attachments/assets/f822bb18-73e3-4aea-bd2c-f76b5f3d7213" />







