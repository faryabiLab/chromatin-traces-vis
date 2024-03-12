## Design doc

### Project abstract

This is a web application to visualize chromatin traces and provide interactive features which can be accessed at https://faryabilab.github.io/chromatin-traces-vis/
<img width="2240" alt="image" src="https://github.com/faryabiLab/chromatin-traces-vis/assets/56408423/f97b2de4-9589-48e8-a327-68feb239bf2e">



### How to use it
1. Upload csv file with the following format
    -   fov: field of view
    -   s: allele
    -   x,y,z: coordinates
    -   readout: step
2. By default, only odd readouts are plotted. Click on plot all points to plot all readouts.
3. Click Import CSV to import your file
4. Select fov and allele number that you want to see
5. Click on the heatmap to highlight the corresponding pairs of vertices 
6. Click on the vertices in the 3D model
    - Click one dot to do radius analysis by adjusting radius in GUI
    - Click two dots to see linkage distance
    - Click three dots after checking the perimeter option to see the perimeter
7. Toggle options in GUI to customize the trace model
8. (optional) Having clicked two nodes, by typing the threshold you can filter the alleles within the same fov that have the distance of this linkage smaller than this threshold
9. Click on DOWNLOAD IMG to download the current view as PDF file
### Technology 

Web framework: React.js

3D model: Three.js

Data analysis: D3.js

UI component: chakra


### TODO Features
- [ ] Data Browser for database


## Data Process

-   Input: csv file uploaded by user
-   Group the file by fov and s
-   default: Take rows with odd readouts(unless clicked on plot all points)
-   fill missing readout (linear filling)
-   Output: `[pos:{x:number,:number,z:number},readout:number]`

