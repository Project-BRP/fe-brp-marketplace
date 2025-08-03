export const REG_USERNAME = /^[a-zA-Z0-9_]{3,15}$/;

export const REG_PHONE_NUMBER = /^\+?(\d[\d-.()\s]*){7,15}$/;

export const REG_EMAIL =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

export const REG_PASS = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const REG_PHONE =
  /^(\+62)?[\s-]?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/;
