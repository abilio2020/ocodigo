/* auth.js — Gestão simples de utilizadores via localStorage */
const STORE_USERS = 'ocodigo_users';
const STORE_SESSION = 'ocodigo_session';

const Auth = {
  hash(s){let h=0;for(let i=0;i<s.length;i++)h=(h<<5)-h+s.charCodeAt(i)|0;return'h'+(h>>>0).toString(16);},
  _users(){return JSON.parse(localStorage.getItem(STORE_USERS)||'[]');},
  _saveUsers(list){localStorage.setItem(STORE_USERS,JSON.stringify(list));},

  signUp(){
    const name=document.getElementById('sign-name').value.trim();
    const email=document.getElementById('sign-email').value.trim().toLowerCase();
    const pass=document.getElementById('sign-pass').value;
    const pass2=document.getElementById('sign-pass2').value;
    const err=document.getElementById('err-sign'); err.textContent='';
    if(!name||!email||pass.length<6||pass!==pass2){err.textContent='Verifique os dados.';return;}
    const users=this._users(); if(users.find(u=>u.email===email)){err.textContent='Email já registado.';return;}
    users.push({name,email,pass:this.hash(pass),createdAt:Date.now()}); this._saveUsers(users);
    localStorage.setItem(STORE_SESSION,JSON.stringify({email,ts:Date.now()}));
    location.href='./index.html';
  },

  signIn(){
    const email=document.getElementById('login-email').value.trim().toLowerCase();
    const pass=document.getElementById('login-pass').value;
    const err=document.getElementById('err-login'); err.textContent='';
    const u=this._users().find(u=>u.email===email&&u.pass===this.hash(pass));
    if(!u){err.textContent='Credenciais inválidas.';return;}
    localStorage.setItem(STORE_SESSION,JSON.stringify({email,ts:Date.now()}));
    location.href='./index.html';
  },

  signOut(){localStorage.removeItem(STORE_SESSION);location.href='./login.html';},

  currentUser(){
    const s=JSON.parse(localStorage.getItem(STORE_SESSION)||'null'); if(!s)return null;
    if(Date.now()-s.ts>30*24*60*60*1000){this.signOut();return null;} // expira em 30 dias
    return this._users().find(u=>u.email===s.email)||null;
  }
};
window.Auth=Auth;
