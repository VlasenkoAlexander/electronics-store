import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InquiryService } from '../../services/inquiry.service';
import { Inquiry } from '../../models/inquiry.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inquiries',
  templateUrl: './inquiries.component.html',
  styleUrls: ['./inquiries.component.css']
})
export class InquiriesComponent implements OnInit {
  inquiries: Inquiry[] = [];
  inquiryForm: FormGroup;
  isAdmin = false;
  responseForms: { [id: number]: string } = {};

  constructor(
    private inquiryService: InquiryService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.inquiryForm = this.fb.group({
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadInquiries();
  }

  loadInquiries(): void {
    if (this.isAdmin) {
      this.inquiryService.getAllInquiries().subscribe(data => this.inquiries = data);
    } else {
      this.inquiryService.getMyInquiries().subscribe(data => this.inquiries = data);
    }
  }

  submitInquiry(): void {
    if (this.inquiryForm.invalid) return;
    this.inquiryService.createInquiry(this.inquiryForm.value)
      .subscribe(res => {
        this.inquiries.push(res);
        this.inquiryForm.reset();
      });
  }

  respond(id: number): void {
    const resp = this.responseForms[id];
    if (!resp) return;
    this.inquiryService.respondInquiry(id, resp)
      .subscribe(updated => {
        const idx = this.inquiries.findIndex(i => i.id === id);
        if (idx !== -1) this.inquiries[idx] = updated;
        delete this.responseForms[id];
      });
  }
}
