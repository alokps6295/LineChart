import { Component, OnInit,EventEmitter } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../services/http.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss'
import { DocumentService } from '../services/document.service';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalGeneric implements OnInit {

    startDate: string;
    endDate: string;
    start;
    end;
    submitBtnText: string;
    comment:string;
    classes: boolean = false;

    submitClick: EventEmitter<any> = new EventEmitter<any>();
    closeClick: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private http:HttpService,
        private doc:DocumentService
        ) {
        }

    ngOnInit() {
    }

    open(content, options) {
      console.log("aaaa")
        this.modalService.open(content, options).result.then((result) => {
        }, (reason) => {
            console.log(reason);
        });
    }
    close(){
        this.activeModal.close();
        this.closeClick.emit(true);
    }

    upload() {
        this.activeModal.close();
        let obj={startDate:this.startDate,
          endDate:this.endDate,
          comment:this.comment,
          start:this.start,
          end:this.end
        }
        console.log(this.comment);
        this.http.post("http://localhost:3001/v1/range/addRange",obj).subscribe((res)=>{
          console.log(res);
          this.doc.getDocument();
          Swal.fire(
            'Added!',
            'Your Record  has been Added.',
            'success'
          )

        },(err)=>{
            Swal.fire(
                'Rejected!',
                'Your Record Addition has Failed.',
                'error'
              )
        })
        this.submitClick.emit(true);
    }


      
}


