

## Project abstract

This is a web application to visualize chromatin traces and provide interactive features which can be accessed at https://faryabilab.github.io/chromatin-traces-vis/ 

<img width="2157" alt="image" src="https://github.com/user-attachments/assets/a9ed9d39-3961-4429-ad70-64c9c69e6d73" />

<img width="2096" alt="image" src="https://github.com/user-attachments/assets/9018a01a-2734-49bb-81b4-363695c2f194" />



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

CSV file with the following columns:

-   fov: field of view
-   s: allele
-   x,y,z: coordinates
-   readout: step

additional columns are ignored

### Sample Data
Click to download an example CSV file: [sample.csv](https://github.com/user-attachments/files/20494724/sample.csv)

#### Sample data details
The sample dataset include three field of views (FOV):
- FOV1: one allele with no missing values
- FOV2: five alleles with no missing values
- FOV3: one allele WITH missing values

### Data pre-process

This program is using linear interpolation to impute the missing values.

<img width="1851" alt="image" src="https://github.com/user-attachments/assets/ca4848f7-4f6e-43fd-96e3-3ff820884aec" />


## 📋 How to Use

### Step 1: Upload Your CSV File

1.   Enter the number of Total Readouts. **This step is required** in order to fill in all the missing values. All the alleles will have this number of total readouts. <img width="1863" alt="image" src="https://github.com/user-attachments/assets/ffe4f440-8023-497c-9d0e-136e468d35d0" />

2.   Drop your CSV file or click to upload. Your file **WILL NOT** be saved to our database.<img width="878" alt="image" src="https://github.com/user-attachments/assets/4cb185c6-23de-43ae-8be4-820f28897d4a" />

3.   Click the button to view your traces. <img width="720" alt="image" src="https://github.com/user-attachments/assets/18dcabfb-9000-47bd-8382-3ca6cc6fb974" />


### OR: Browse the files stored in our database

1.   Use table filter. <img width="1550" alt="image" src="https://github.com/user-attachments/assets/5fbb6c7f-9477-4001-a540-af85234307b1" />

2.   Inspect metadata. <img width="2128" alt="image" src="https://github.com/user-attachments/assets/e8535dcb-05ef-4d5b-b8dc-8ef4a271db3d" />

3.   Click view. <img width="1677" alt="Google Chrome 2025-05-29 12 18 03" src="https://github.com/user-attachments/assets/2b8bf651-9d98-434f-b988-a2bc806e24d4" />


### Step 2: Select FOV and Allele to choose the allele


1.   Click two dots to view the distance.  <img width="991" alt="image" src="https://github.com/user-attachments/assets/6f3ab74a-94af-4d71-854d-e55686fd8d40" />

2.   Use GUI to adjust
     1.   Color
     2.   Toggle Grid and axis
     3.   Line Size
     4.   Dot Size
     5.   Toggle the distance label of a selected linkage

     6.   Radius: only dots that are within this distance to the selected dot are colored. <img width="1125" alt="image" src="https://github.com/user-attachments/assets/9ac4da27-fde4-44bc-83e6-bcbca909617a" />


     7. Click Reset to clear all the selection of the dots. <img width="987" alt="image" src="https://github.com/user-attachments/assets/c52fa03e-5d2d-4591-b31d-4d60f31458c1" />



3.   If you select the Perimeter option in the GUI, click any three dots to view the perimeter. Uncheck this box to go back to linkage mode. <img width="1105" alt="image" src="https://github.com/user-attachments/assets/f8e09728-2b69-412b-a44c-216698441ce4" />


4.    Having clicked two nodes, by typing the threshold you can filter the alleles *within the same fov* that have the distance of this linkage smaller than this threshold. <img width="1807" alt="image" src="https://github.com/user-attachments/assets/16c01fb2-fec1-4f7d-a7ad-ccca5e133b59" />


### Step 3: Panels

1.   Distance Heatmap

     1.   Click any grid cell to view the linkage in the 3D model. <img width="1816" alt="image" src="https://github.com/user-attachments/assets/2000e2e3-32bd-42db-99ca-28886da9f3f9" />


     2.   Use the filter to filter the linkage whose distance is within the range. <img width="698" alt="image" src="https://github.com/user-attachments/assets/a7bcb08d-ab24-4a39-b2dc-5db149142a01" />


2.   Distance to the geometric center. <img width="1987" alt="image" src="https://github.com/user-attachments/assets/92cb2074-2380-4c98-a21c-77ca6867e227" />


3.   Radius of Gyration. <img width="1929" alt="image" src="https://github.com/user-attachments/assets/6f1111a3-3bc9-43ec-bab1-87faf15d4bb8" />






