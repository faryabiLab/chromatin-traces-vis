## Design doc

### Project abstract

This is a web application to visualize chromatin traces and provide interactive features which can be accessed at https://faryabilab.github.io/chromatin-traces-vis/

### Technology 

Web framework: React.js

3D model: Three.js

Data analysis: D3.js

UI component: chakra

### Components structure

|----Panel

​		|----Welcome(upload file)

​		|----CanvasWrapper

​			|---- Welcome Select

​			|----Plot (3D model)

​		|---Dashboard

​			|----Heatmap

### Store:

**DataProvider**: load csv file and parse it into a map grouped by fov and s

-   dataBys: map of data grouped by fov and s
-   setDataBysHandler

**TraceProvider**: Given the data by s, perform data wrangling

-   data: processed data of selected fov-s
-   selected: selected fov and s
-   clicked: clicked pair of nodes
-   plotAll: plot all the points or only odd points
-   selectedHandler
-   clickedHandler
-   resetHandler

### TODO Features

1.   interactive 3D visualization of chromatin trace per for per allele 

     -   [x] Click to color vertices pair

     -   [x] Click on vertices show distance pairwise

     -   [x] Click on vertices light up corresponding heat map rect
     -   [x] gizmo helper
     -   [ ] Color vertices of certain attributes
     -   [ ] triangle perimeter mode

2.   interactive heatmap visualization of pairwise distances

     -   [x] Click on rect to highlight the x/y label

     -   [x] Click on rect to color vertices pair in 3D model
     -   [x] Filter distances given threshold using color scale

     -   [x] Heatmap color palette choice
     -   [x] Clear click choice

3.   User interface

     -   [x] user upload csv file
     -   [x] Plot all points option
     -   [ ] uploaded file validation
     -   [ ] only show existing alleles in selection
     -   [x] instructions in welcome page
     


## Data Process

-   Input: csv file uploaded by user
-   Group the file by fov and s
-   default: Take rows with odd readouts(unless clicked on plot all points)
-   fill missing readout (linear filling)
-   Output: `[pos:{x:number,:number,z:number},readout:number]`

## Improvement

### Structure

-   Divide Heatmap/Plot into smaller components

### UI

-   Responsive layout
-   css modules

### Performance

-   eliminate unecessary rendering
