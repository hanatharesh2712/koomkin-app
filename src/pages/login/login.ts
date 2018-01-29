import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ReportePage } from '../reporte/reporte'

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {

  userdata: any;
  loading: any;
  loginForm: FormGroup;
  data: any;
  datos;
  leads;
  email;
  password;
  acceso;

  erroresForm = {
    'email': '',
    'password': ''
   }

  mensajesValidacion = {
    'email': {
      'required': 'Correo Electronico obligatorio',
      'email': 'Introduzca un Correo Electronico correcto'
    },
    'password': {
      'required': 'Contraseña obligatoria',
      'password': 'La contraseña esta incorrecta'
    }
  }

  constructor(public navCtrl: NavController,
    public authService: AuthServiceProvider,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder) { }

    onValueChanged(data?: any) {
      if (!this.loginForm) { return; }
      const form = this.loginForm;
      for (const field in this.erroresForm) {
        
        this.erroresForm[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.mensajesValidacion[field];
          for (const key in control.errors) {
            this.erroresForm[field] += messages[key] + ' ';
           }
         }
       }
     }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required],
    })
    this.loginForm.valueChanges
    .subscribe(data=> this.onValueChanged(data))
    this.onValueChanged();
  }

 /* onSubmit() {
    this.userdata = this.saveUserdata();
    console.log(this.userdata);
  }
*/
  public saveUserdata() {
    let saveUserdata = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    }
    return saveUserdata;
  }

 /* public getUserByEmail() {
    let datos = this.authService.getUserByEmail(this.email,this.password,this.acceso)
  }*/

  doLogin() {
    this.userdata = this.saveUserdata();
    this.email = this.userdata.email;
    this.password = this.userdata.password;
    //console.log(this.email,this.password);
    this.showLoader();
    let datos = this.authService.getUserByEmail(this.email,this.password,this.acceso)
      this.loading.dismiss();
      this.data = datos;
      if(this.acceso == true){
        this.navCtrl.setRoot(ReportePage);
      }
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Iniciando Sesión...'
    });
    this.loading.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

}
