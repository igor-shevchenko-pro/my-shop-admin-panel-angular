import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'admin-panel';
  public dynamicScripts = [
    // Resolve conflict in jQuery UI tooltip with Bootstrap tooltip
    'assets/js/script.js',
    'assets/js/control-sidebar.js',
    // in order to avoid pushmenu and treeview bugs
    'assets/js/adminlte.js',
  ];

  constructor(private primengConfig: PrimeNGConfig) {
    this.loadScripts();
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  // Add custom js files
  private loadScripts() {
    for (let i = 0; i < this.dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = this.dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      node.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }

}