import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit {

  @Input() public title = 'Editar estación';
  @Input() public content = 'Por favor, ingrese los nuevos detalles de la estación';
  @Input() public trigger = '';
  @Input() public myClass = '';
  @Input() public isDisabled = false;
  @Input() public placeholder = 'Ingrese el nuevo nombre';
  @Input() public detail = 'Nuevo nombre';
  @Input() public confirm = 'Confirmar edición';

  @Output() public send = new EventEmitter<string>();
  @Output() public cancel = new EventEmitter<string>();
  @Output() public reject = new EventEmitter<string>();

  public form: FormGroup;
  public modalReference: any;

  constructor(private modalService  : NgbModal,
              private fb            : FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.compose([Validators.required])]
    });
  }

  public open(content) {
    if (!this.isDisabled) {
      this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
      this.modalReference.result.then(result => {
        switch (result) {
          case 'YES':
            this.send.emit(this.form.controls['estado'].value);
            break;
          case 'NO':
            this.reject.emit();
            break;
          default:
            this.cancel.emit();
            break;
        }
      }, close => {
        this.cancel.emit();
      });
    }
  }

  public submit(){
    if(!this.form.valid){
      this.form.markAllAsTouched();
    }else{
      this.modalReference.close();
      let comment : string = this.form.controls['estado'].value;
      this.send.emit(comment);
    }
  }

  public getClass(controlName : string) : string{
    let control = this.form.controls[controlName];
    if(!control.touched){
      return '';
    }
    return control.hasError('required') ? 'is-invalid' : 'is-valid'; 
  }

}
