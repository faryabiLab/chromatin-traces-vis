

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

1.   Click the button to start uploading. <img width="2036" alt="image" src="https://github.com/user-attachments/assets/e43c301c-2227-4d80-8306-6bd872d5e8cf" />

2.   Enter the number of Total Readouts. **This step is required** in order to fill in all the missing values. All the alleles will have this number of total readouts. <img width="2002" alt="image" src="https://github.com/user-attachments/assets/47121db2-cca5-40a2-a3de-8a4d86fa7ad2" />

3.   Drop your CSV file or click to upload. Your file **WILL NOT** be saved to our database.<img width="1946" alt="image" src="https://github.com/user-attachments/assets/b736acb3-53da-4c14-8c8b-b0caf732167d" />

4.   Click the button to view your traces. <img width="1913" alt="image" src="https://github.com/user-attachments/assets/0f170634-fd7d-4b57-9856-7964aab4338f" />


### OR: Browse the files stored in our database

1.   Use the shortcuts to view available chromatin traces. <img width="2039" alt="image" src="https://github.com/user-attachments/assets/ceacd3af-7b0c-42ea-8ea5-9826bbd1a165" />

2.   You can fill the form to submit metadata to us.

3.   Keyword is pre-set for your convenience. You can clear the search bar to view the whole database. <img width="2050" alt="image" src="https://github.com/user-attachments/assets/72e95d50-d3d5-4d87-815d-18e32b4a01d2" />

4.   Use column filter. <img width="2048" alt="image" src="https://github.com/user-attachments/assets/a893681f-f8ab-4560-936a-540a5307b7be" />

5.   Inspect metadata. <img width="2156" alt="image" src="https://github.com/user-attachments/assets/ed97d673-fe6a-432c-a0e1-4fdeefa649c9" />

6.   Click view. <img width="1677" alt="Google Chrome 2025-05-29 12 18 03" src="https://github.com/user-attachments/assets/2b8bf651-9d98-434f-b988-a2bc806e24d4" />


### Step 2: Visualization

1.   Select FOV and Allele to view any trace. <img width="775" alt="image" src="https://github.com/user-attachments/assets/aba0e634-d1b2-4a8b-95a8-9e45436619c1" />

2.   Click any two dots in the model to view the distance.  <img width="991" alt="image" src="https://github.com/user-attachments/assets/6f3ab74a-94af-4d71-854d-e55686fd8d40" />

3.   Use GUI to adjust
     1.   Color
     2.   Toggle Grid and axis
     3.   Line Size
     4.   Dot Size
     5.   Toggle the distance label of a selected linkage

     6.   Radius: only dots that are within this distance to the selected dot are colored. <img width="1125" alt="image" src="https://github.com/user-attachments/assets/9ac4da27-fde4-44bc-83e6-bcbca909617a" />


     7. Click Reset to clear all the selection of the dots. <img width="987" alt="image" src="https://github.com/user-attachments/assets/c52fa03e-5d2d-4591-b31d-4d60f31458c1" />



4.   If you select the Perimeter option in the GUI, click any three dots to view the perimeter. Uncheck this box to go back to linkage mode. <img width="1105" alt="image" src="https://github.com/user-attachments/assets/f8e09728-2b69-412b-a44c-216698441ce4" />


5.    Having clicked two nodes, by typing the threshold you can filter the alleles *within the same fov* that have the distance of this linkage smaller than this threshold. <img width="1807" alt="image" src="https://github.com/user-attachments/assets/16c01fb2-fec1-4f7d-a7ad-ccca5e133b59" />


### Step 3: Panels

1.   Distance Heatmap

     1.   Click any grid cell to view the linkage in the 3D model. <img width="1816" alt="image" src="https://github.com/user-attachments/assets/2000e2e3-32bd-42db-99ca-28886da9f3f9" />


     2.   Use the filter to filter the linkage distances that are within the range. <img width="698" alt="image" src="https://github.com/user-attachments/assets/a7bcb08d-ab24-4a39-b2dc-5db149142a01" />


2.   Distance to the geometric center. <img width="1987" alt="image" src="https://github.com/user-attachments/assets/92cb2074-2380-4c98-a21c-77ca6867e227" />


3.   Radius of Gyration. <img width="1929" alt="image" src="https://github.com/user-attachments/assets/6f1111a3-3bc9-43ec-bab1-87faf15d4bb8" />






