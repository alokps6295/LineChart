import { Component, OnInit } from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import * as dchart from 'd3';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Brush from 'd3-brush';
import * as d3TimeFormat from 'd3-time-format';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalGeneric } from '../shared/modal/modal.component';
import { DocumentService } from '../shared/services/document.service';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
    title = 'Line Chart';
    data: any[];
    comments=["AAAAAAAAAAAAAA","B"];
    color;
    private margin = {top: 20, right: 20, bottom: 30, left: 50};
    private width: number;
    private height: number;
    private x: any;
    private y: any;
    documents;
    private svg: any;
    private brush:any;
    private parseDate = d3TimeFormat.timeFormat("%x");
    private line: d3Shape.Line<[number, number]>; // this is line defination

  constructor(private http:HttpClient,private modalService: NgbModal,private documentService: DocumentService) {
      // configure margins and width/height of the graphself=this;
   this.width = 960 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
    }
  ngOnInit() {
    this.documentService.getDocument();
    this.documentService.documents.subscribe((docs)=>{
      this.documents=docs
      this.documents.forEach(elem => {
        this.buildGradient(elem.start,elem.end,elem.comment);
      });
      console.log(this.documents)
    });
    console.log(this.documents);
      this.http.get('assets/data.csv', { responseType: 'text' }).subscribe(val => {
          this.data = dchart.csvParse(val);
          console.log("data:::",this.data);
          this.data=this.parseData(this.data);
          console.log(this.data);   
          this.buildSvg();
          this.addXandYAxis();
          this.setColor();
          this.brush = dchart.brushX().extent([[0,0],[this.width,this.height]]).on("end",this.brushed);
          this.drawLineAndPath();

       
        //  this.dragBeh();
      
          

      });
   
     
  }
  

  parseData(data: any[]){
    return data.map((v)=> {return {date: this.parseDate(new Date(v.Date)), close: v.Close}});
  }
/* dragBeh(){
    this.drag=dchart.behaviour.drag()
    .on("dragstart",function(d){

    })
} */
setColor(){
    this.color = dchart.scaleOrdinal()
    .domain(this.comments)
    .range(dchart.schemeSet2);
    console.log(this.color)
}

buildGradient(x1,x2,comment){
    var size = 20;
    this.svg.selectAll("rect").style("opacity",0.3);
    this.svg.selectAll(".myRect")
      .data(this.comments)
      .enter()
      .append("rect")
        .attr("x", x1)
        .attr("y", 0) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", x2-x1)
        .attr("height", this.height)
        .style("fill", "rgba(181, 74, 74, 0.50)")
    
        this.svg.append("text")
        .attr("text-anchor","start")
        .attr("x",x1+2)
        .attr("y",this.height)
        .text(comment)
       
      
   // this.gradient = defs.append("linearGradient").attr("id", "svgGradient");
}

    buildSvg() {
        this.svg = d3.select('svg')
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
    }
    brushed=()=> {
      //  console.log("functionCalled",this.x);
        let e=this.brush.extent().call();
       
        const ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false,
            centered: true
          };
        let selectionCoord=dchart.event.selection;
       if(selectionCoord){
        let targetX1 = selectionCoord[0];
        let targetX2 = selectionCoord[1];    
        let startDate =this.x.invert(targetX1);
        let endDate=this.x.invert(targetX2);
        this.buildGradient(targetX1,targetX2,"");
        console.log(startDate,endDate);
        const modal = this.modalService.open(ModalGeneric,ngbModalOptions);
        console.log(this.x.invert(startDate),endDate,modal);
        modal.componentInstance.startDate =startDate;
        modal.componentInstance.endDate = endDate;
        modal.componentInstance.start=targetX1;
        modal.componentInstance.end=targetX2;
       }
   
    }
    addXandYAxis() {
         // range of data configuring
         this.x = d3Scale.scaleTime().domain([d3Array.extent(this.data, (d) => {return new Date(d.date) })]).range([0, this.width]);
         this.y = d3Scale.scaleLinear().domain(d3Array.extent(this.data, (d) =>{return Number(d.close)})).range([this.height, 0]);
         console.log(this.x.domain(d3Array.extent(this.data, (d) => new Date(d.date) )));
         /* this.x.domain(d3Array.extent(this.data, (d) => new Date(d.Date).getTime() ))
         this.y.domain(d3Array.extent(this.data, (d) => Number(d.Close)));
 */
        // Configure the Y Axis
        let p= this.svg.append('g')
        .classed('x axis', true)
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3Axis.axisBottom(this.x)
            .tickFormat(d3TimeFormat.timeFormat("%Y-%m-%d")) );
        // Configure the Y Axis\
        this.svg.append('g')
            .attr('class', 'axis axis--y')
            .call(d3Axis.axisLeft(this.y));

    }

    private drawLineAndPath() {
        console.log(this.x)
        this.line = d3Shape.line()
            .x( (d: any) => this.x(new Date(d.date)) )
            .y( (d: any) => this.y(Number(d.close)));
        // Configuring line path
        this.svg.append("g")
        .attr("class","brush")
        .call(this.brush)
        .on("click", (d, i) =>{
            console.log(this.x.domain()[i],i);
            console.log(this.x.range())
          });
         this.svg.append('path')
            .datum(this.data)
            .attr('class', 'line')
            .attr('d', this.line);
            console.log("caliing brush")        
    }

}
