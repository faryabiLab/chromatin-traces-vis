

## Project abstract

This is a web application to visualize chromatin traces and provide interactive features which can be accessed at https://faryabilab.github.io/chromatin-traces-vis/

<img width="2219" alt="image" src="https://github.com/user-attachments/assets/d0db17c4-658d-4737-a0d3-a07936d847b2" />

<img width="2210" alt="image" src="https://github.com/user-attachments/assets/71763ffa-c57b-493f-80c1-44284b518bdd" />


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

Click to download an example CSV file: [sample.csv](https://github.com/user-attachments/files/20494724/sample.csv)

### Data pre-process

This program is using linear interpolation to impute the missing values.

## 📋 How to Use

### Step 1: Upload Your CSV File

1.   Enter the number of Total Readouts. **This step is required** in order to fill in all the missing values. All the alleles will have this number of total readouts.
2.   Drop your CSV file or click to upload. Your file **WILL NOT** be saved to our database.
3.   Click the button to view your traces

### OR: Browse the files stored in our database

1.   Use table filter
2.   Inspect metadata table
3.   Click view

### Step 2: Select FOV and Allele to choose the allele

1.   Click two dots to view the distance. The corresponding grid cell in the distance heatmap will be highlighted.
2.   Use GUI to adjust
     1.   Color
     2.   Toggle Grid and axis
     3.   Line Size
     4.   Dot Size
     5.   Toggle the distance label of a selected linkage
     6.   Radius: only dots that are within this distance to the selected dot are colored.
3.   If you select the Perimeter option in the GUI, click any three dots to view the perimeter. Uncheck this box to go back to linkage mode.
4.    Having clicked two nodes, by typing the threshold you can filter the alleles *within the same fov* that have the distance of this linkage smaller than this threshold

### Step 3: Panels

1.   Distance Heatmap
     1.   Click any grid cell to view the linkage in the 3D model
     2.   Use the filter to filter the linkage whose distance is within the range
2.   Distance to the geometric center
3.   Radius of Gyration





