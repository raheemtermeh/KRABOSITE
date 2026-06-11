import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { createGlobalStyle } from "styled-components";
import axios from "axios";
import NumberFormat from "react-number-format";
import { round } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faShoppingCart,
  faUser,
  faBars,
  login,
} from "@fortawesome/free-solid-svg-icons";

const GlobalStyles = createGlobalStyle`
  :root {
    --primary: #880a0a;
    --primary-dark: #6b0506;
    --primary-light: #f17b33;
    --primary-gradient: linear-gradient(135deg, #880a0a 0%, #6b0506 100%);
    --accent: #ff8c00;
    --bg-light: #fefaf5;
    --bg-white: #ffffff;
    --text-dark: #2d2d2d;
    --text-light: #666666;
    --shadow-sm: 0 4px 15px rgba(0,0,0,0.05);
    --shadow-md: 0 8px 25px rgba(0,0,0,0.08);
    --shadow-lg: 0 15px 35px rgba(0,0,0,0.1);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', 'Vazir', system-ui, sans-serif;
    background: var(--bg-light);
  }

  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
  ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--primary-dark); }

  .main-header {
    background: white;
    border-bottom: 2px solid #000;
  }

  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    position: relative;
  }

  .gold-price-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .gold-label-new {
    font-size: 20px;
    color: #3d4452;
    font-weight: 500;
    font-style: normal;
    white-space: nowrap;
  }

  .gold-value-new {
    font-size: 20px;
    font-weight: 700;
    color: #3d4452;
    white-space: nowrap;
  }

  .logo-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .logo-center img {
    width: 350px;
    height: auto;
    transition: width 0.3s ease;
  }

  .logo-text {
    font-size: 48px;
    font-weight: 300;
    letter-spacing: 12px;
    color: #000000;
    font-family: 'Arial', sans-serif;
  }

  .header-icons {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: nowrap;
  }

  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 22px;
    color: #000;
    transition: color 0.2s;
    padding: 0;
    position: relative;
  }

  .icon-btn:hover {
    color: var(--primary);
  }

  .cart-badge {
    position: relative;
  }

  .gold-blink {
    width: 10px;
    height: 10px;
    background: linear-gradient(135deg, #ffd700, #ffed4e, #ffd700);
    border-radius: 50%;
    animation: blink 1.5s ease-in-out infinite;
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
  }

  @keyframes blink {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(0.9); }
  }

  .cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background: var(--primary);
    color: white;
    font-size: 10px;
    font-weight: bold;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ===== دکمه‌های پروفایل و سبد خرید دسکتاپ ===== */
  .profile-btn-desktop,
  .cart-btn-desktop,
  .login-btn-desktop,
  .search-btn-desktop {
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* منوی افقی */
  .nav-menu-horizontal {
    background: linear-gradient(135deg, #ffffff 0%, #faf9f8 100%);
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    border-bottom: 3px solid #000;
    border-image: linear-gradient(90deg, #000000, #000000, #000000);
    border-image-slice: 1;
    position: relative;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  }

  .nav-menu-horizontal::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #880a0a 25%, #000000 50%, #880a0a 75%, transparent 100%);
    animation: borderGlow 3s ease-in-out infinite;
  }

  @keyframes borderGlow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  .menu-horizontal-list {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 0;
    position: relative;
  }

  .menu-horizontal-item {
    position: relative;
    flex: 1;
    text-align: center;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .menu-horizontal-item::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #880a0a, #ff8c00);
    transition: all 0.4s ease;
    transform: translateX(-50%);
  }

  .menu-horizontal-item:hover::before {
    width: 80%;
  }

  .menu-horizontal-link {
    display: block;
    padding: 18px 24px;
    color: #2c3e50;
    text-decoration: none;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.5px;
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    white-space: nowrap;
  }

  .menu-horizontal-link::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(136,10,10,0.05), transparent);
    transition: left 0.5s ease;
  }

  .menu-horizontal-link:hover::before {
    left: 100%;
  }

  .menu-horizontal-link:hover {
    color: #880a0a;
    transform: translateY(-2px);
  }

  .menu-horizontal-item:hover {
    background: linear-gradient(135deg, rgba(136,10,10,0.03), rgba(255,140,0,0.02));
    transform: translateY(-3px);
  }

  /* ===== Dropdown Menu ===== */
  .dropdown-menu-edit {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(0, 0, 0, 0.15);
    padding: 24px;
    min-width: 300px;
    max-width: 90vw;
    width: max-content;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    z-index: 1000;
  }

  .menu-horizontal-item:hover .dropdown-menu-edit {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0);
  }

  .dropdown-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    animation: dropdownFadeIn 0.3s ease;
  }

  @keyframes dropdownFadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .dropdown-items-edit {
    padding: 16px 20px;
    flex: 1 1 auto;
    min-width: 190px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 16px;
    position: relative;
    overflow: hidden;
  }

  .dropdown-items-edit::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(136,10,10,0.03), rgba(255,140,0,0.01));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .dropdown-items-edit:hover::before {
    opacity: 1;
  }

  .dropdown-items-edit:hover {
    transform: translateY(-5px) translateX(-2px);
    box-shadow: 0 8px 25px rgba(136,10,10,0.12);
    background: linear-gradient(135deg, #ffffff, #fffaf5);
  }

  .dropdown-title {
    font-weight: 700;
    background: linear-gradient(135deg, #880a0a, #ff8c00);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    margin-bottom: 16px;
    font-size: 18px;
    position: relative;
    display: inline-block;
    letter-spacing: 0.5px;
  }

  .dropdown-title::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #880a0a, #ff8c00);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .dropdown-items-edit:hover .dropdown-title::after {
    width: 70px;
  }

  .subDropDown {
    list-style: none;
    padding-right: 0;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .subDropDown li {
    margin: 0;
    transform: translateX(0);
    transition: all 0.2s ease;
  }

  .subDropDown li:hover {
    transform: translateX(5px);
  }

  .submenu-link {
    display: block;
    padding: 6px 0;
    color: #5a6e7a;
    font-size: 14px;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;
    position: relative;
  }

  .submenu-link::before {
    content: '→';
    position: absolute;
    right: -15px;
    opacity: 0;
    transition: all 0.3s ease;
    color: #880a0a;
  }

  .submenu-link:hover {
    color: #880a0a;
    padding-right: 20px;
    transform: translateX(5px);
  }

  .submenu-link:hover::before {
    opacity: 1;
    right: 0;
  }

  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: white;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    animation: slideDown 0.5s ease;
  }

  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .dropdown-menu-edit::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    background: white;
    border-left: 1px solid rgba(136,10,10,0.15);
    border-top: 1px solid rgba(136,10,10,0.15);
    transform: translateX(-50%) rotate(45deg);
    z-index: -1;
  }

  .dropdown-menu-edit::-webkit-scrollbar { width: 6px; }
  .dropdown-menu-edit::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
  .dropdown-menu-edit::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #880a0a, #ff8c00); border-radius: 10px; }

  /* ===== Search Modal ===== */
  .search-modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.6);
    z-index: 9999;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 100px;
    animation: fadeIn 0.2s ease;
  }

  .search-modal-content {
    background: white;
    border-radius: 16px;
    padding: 24px;
    width: 90%;
    max-width: 700px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    animation: slideDown 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* ===== Mobile Menu ===== */
  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #000;
    padding: 8px;
  }

  .mobile-menu-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.6);
    z-index: 9998;
    animation: fadeIn 0.3s ease;
  }

  .mobile-menu-sidebar {
    position: fixed;
    top: 0; right: 0; bottom: 0;
    width: 280px;
    background: white;
    z-index: 9999;
    overflow-y: auto;
    animation: slideInRight 0.3s ease;
    box-shadow: -4px 0 20px rgba(0,0,0,0.2);
  }

  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  .mobile-menu-header {
    padding: 20px;
    border-bottom: 2px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .mobile-menu-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #000;
  }

  .mobile-menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .mobile-menu-item {
    border-bottom: 1px solid #f0f0f0;
  }

  .mobile-menu-link {
    display: block;
    padding: 16px 20px;
    color: #000;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
  }

  .mobile-menu-link:hover {
    background: #f5f5f5;
    color: var(--primary);
  }

  .mobile-submenu {
    list-style: none;
    padding: 0;
    margin: 0;
    background: #fafafa;
  }

  .mobile-submenu-item {
    padding: 12px 20px 12px 40px;
    border-bottom: 1px solid #f0f0f0;
  }

  .mobile-submenu-title {
    font-weight: 600;
    color: var(--primary);
    font-size: 14px;
    margin-bottom: 8px;
  }

  .mobile-submenu-link {
    display: block;
    padding: 6px 0;
    color: var(--text-light);
    text-decoration: none;
    font-size: 13px;
  }

  /* =================================================== */
  /* ===== ریسپانسیو پیشرفته برای دسکتاپ و موبایل ===== */
  /* =================================================== */

  /* ===== دسکتاپ بزرگ (1600px+) ===== */
  @media (min-width: 1600px) {
    .logo-center img { width: 400px; }
    .dropdown-menu-edit { min-width: 600px; }
    .dropdown-items-edit { min-width: 220px; }
    .menu-horizontal-link { padding: 20px 30px; font-size: 16px; }
    .gold-label-new { font-size: 22px; }
    .gold-value-new { font-size: 22px; }
  }

  /* ===== دسکتاپ (1400px - 1600px) ===== */
  @media (max-width: 1600px) and (min-width: 1401px) {
    .logo-center img { width: 350px; }
    .dropdown-menu-edit { min-width: 550px; }
    .dropdown-items-edit { min-width: 200px; }
    .menu-horizontal-link { padding: 18px 24px; font-size: 15px; }
  }

  /* ===== دسکتاپ متوسط (1280px - 1400px) ===== */
  @media (max-width: 1400px) and (min-width: 1281px) {
    .logo-center img { width: 320px; }
    .dropdown-menu-edit { min-width: 500px; padding: 20px; }
    .dropdown-items-edit { min-width: 180px; padding: 14px 16px; }
    .menu-horizontal-link { padding: 16px 18px; font-size: 14px; }
    .gold-label-new { font-size: 18px; }
    .gold-value-new { font-size: 18px; }
    .header-icons { gap: 10px; }
    .profile-btn-desktop, .cart-btn-desktop, .login-btn-desktop, .search-btn-desktop {
      padding: 7px 14px;
      font-size: 13px;
    }
  }

  /* ===== دسکتاپ کوچک (1200px - 1280px) ===== */
  @media (max-width: 1280px) and (min-width: 1201px) {
    .logo-center img { width: 280px; }
    .dropdown-menu-edit { min-width: 450px; padding: 18px; }
    .dropdown-items-edit { min-width: 160px; padding: 12px 14px; }
    .dropdown-title { font-size: 16px; margin-bottom: 12px; }
    .submenu-link { font-size: 13px; }
    .menu-horizontal-link { padding: 14px 14px; font-size: 13px; letter-spacing: 0.3px; }
    .gold-label-new { font-size: 16px; }
    .gold-value-new { font-size: 16px; }
    .header-icons { gap: 8px; }
    .profile-btn-desktop, .cart-btn-desktop, .login-btn-desktop, .search-btn-desktop {
      padding: 6px 12px;
      font-size: 12px;
      gap: 4px;
    }
  }

  /* ===== لپ‌تاپ کوچک (1100px - 1200px) ===== */
  @media (max-width: 1200px) and (min-width: 1101px) {
    .logo-center img { width: 240px; }
    .dropdown-menu-edit { min-width: 420px; padding: 16px; }
    .dropdown-items-edit { min-width: 150px; padding: 10px 12px; }
    .menu-horizontal-link { padding: 14px 12px; font-size: 13px; }
    .gold-label-new { font-size: 14px; }
    .gold-value-new { font-size: 14px; }
    .header-icons { gap: 6px; }
    .profile-btn-desktop, .cart-btn-desktop, .login-btn-desktop, .search-btn-desktop {
      padding: 6px 10px;
      font-size: 12px;
    }
  }

  /* ===== تبلت (1024px - 1100px) ===== */
  @media (max-width: 1100px) and (min-width: 1025px) {
    .logo-center img { width: 220px; }
    .dropdown-menu-edit { min-width: 380px; padding: 14px; }
    .dropdown-items-edit { min-width: 140px; padding: 10px; }
    .dropdown-title { font-size: 15px; }
    .submenu-link { font-size: 12px; padding: 4px 0; }
    .menu-horizontal-link { padding: 12px 10px; font-size: 12px; }
    .gold-label-new { font-size: 13px; }
    .gold-value-new { font-size: 13px; }
    .header-icons { gap: 6px; }
    .profile-btn-desktop, .cart-btn-desktop, .login-btn-desktop, .search-btn-desktop {
      padding: 5px 8px;
      font-size: 11px;
    }
    .header-top { padding: 16px 0; }
  }

  /* ===== تبلت کوچک (992px - 1024px) ===== */
  @media (max-width: 1024px) and (min-width: 993px) {
    .logo-center img { width: 200px; }
    .dropdown-menu-edit { min-width: 360px; padding: 12px; }
    .dropdown-items-edit { min-width: 130px; padding: 8px; }
    .menu-horizontal-link { padding: 12px 8px; font-size: 12px; }
    .gold-label-new { font-size: 12px; }
    .gold-value-new { font-size: 12px; }
    .header-icons { gap: 4px; }
    .profile-btn-desktop, .cart-btn-desktop, .login-btn-desktop, .search-btn-desktop {
      padding: 5px 6px;
      font-size: 11px;
      border-width: 1.5px;
    }
  }

  /* ===== موبایل (768px و کوچکتر) ===== */
  @media (max-width: 992px) {
    .logo-center {
      position: static;
      transform: none;
      order: 2;
      flex: 1;
      text-align: center;
    }

    .logo-center img { width: 180px; }

    .gold-price-left {
      order: 1;
      flex-shrink: 0;
    }

    .gold-label-new { font-size: 10px; }
    .gold-value-new { font-size: 11px; }

    .header-icons {
      order: 3;
      gap: 10px;
      flex-shrink: 0;
    }

    .icon-btn { font-size: 20px; }

    /* مخفی کردن دکمه‌های متنی در موبایل */
    .search-btn-desktop,
    .login-btn-desktop,
    .profile-btn-desktop,
    .cart-btn-desktop {
      display: none !important;
    }

    /* نمایش آیکون‌های موبایل */
    .search-icon-mobile,
    .profile-icon-mobile,
    .cart-icon-mobile {
      display: block !important;
    }

    .mobile-menu-btn {
      display: block;
    }

    .nav-menu-horizontal {
      display: none;
    }

    .header-top {
      padding: 15px 0;
      flex-wrap: nowrap;
    }

    .search-modal-overlay {
      padding-top: 20px;
    }

    .search-modal-content {
      padding: 16px;
      border-radius: 12px;
    }
  }

  @media (max-width: 480px) {
    .logo-center img { width: 140px; }
    .gold-label-new { font-size: 8px; }
    .gold-value-new { font-size: 10px; }
    .header-icons { gap: 8px; }
    .icon-btn { font-size: 18px; }
    .cart-count { width: 16px; height: 16px; font-size: 9px; }
  }

  /* مخفی کردن آیکون‌های موبایل در دسکتاپ */
  @media (min-width: 993px) {
    .search-icon-mobile,
    .profile-icon-mobile,
    .cart-icon-mobile {
      display: none !important;
    }
  }

  /* =================================================== */
  /* ===== ریسپانسیو کامل زیرمنوها (Dropdown) ===== */
  /* =================================================== */

  /* --- جلوگیری از بیرون زدن دراپ‌داون از سمت چپ/راست صفحه --- */
  .dropdown-menu-edit {
    max-width: calc(100vw - 32px);
    overflow-x: hidden;
  }

  /* --- اسکرول داخلی برای دراپ‌داون‌های خیلی بزرگ --- */
  .dropdown-menu-edit {
    max-height: 70vh;
    overflow-y: auto;
  }

  /* --- دسکتاپ بزرگ (1600px+) --- */
  @media (min-width: 1600px) {
    .dropdown-menu-edit {
      max-width: 900px;
      padding: 28px;
    }
    .dropdown-grid {
      gap: 20px;
    }
    .dropdown-items-edit {
      min-width: 240px;
      padding: 18px 22px;
    }
    .dropdown-title {
      font-size: 19px;
      margin-bottom: 18px;
    }
    .submenu-link {
      font-size: 15px;
      padding: 7px 0;
    }
    .subDropDown {
      gap: 10px;
    }
  }

  /* --- دسکتاپ (1400px - 1600px) --- */
  @media (max-width: 1600px) and (min-width: 1401px) {
    .dropdown-menu-edit {
      max-width: 800px;
      padding: 26px;
    }
    .dropdown-grid {
      gap: 18px;
    }
    .dropdown-items-edit {
      min-width: 220px;
      padding: 16px 20px;
    }
    .dropdown-title {
      font-size: 18px;
    }
    .submenu-link {
      font-size: 14px;
    }
  }

  /* --- دسکتاپ متوسط (1280px - 1400px) --- */
  @media (max-width: 1400px) and (min-width: 1281px) {
    .dropdown-menu-edit {
      max-width: 720px;
      padding: 22px;
      border-radius: 18px;
    }
    .dropdown-grid {
      gap: 16px;
    }
    .dropdown-items-edit {
      min-width: 200px;
      padding: 14px 18px;
      border-radius: 14px;
    }
    .dropdown-title {
      font-size: 17px;
      margin-bottom: 14px;
    }
    .submenu-link {
      font-size: 14px;
      padding: 5px 0;
    }
    .subDropDown {
      gap: 7px;
      margin-top: 10px;
    }
  }

  /* --- دسکتاپ کوچک (1200px - 1280px) --- */
  @media (max-width: 1280px) and (min-width: 1201px) {
    .dropdown-menu-edit {
      max-width: 650px;
      padding: 20px;
      border-radius: 16px;
    }
    .dropdown-grid {
      gap: 14px;
    }
    .dropdown-items-edit {
      min-width: 180px;
      padding: 12px 16px;
      border-radius: 12px;
    }
    .dropdown-title {
      font-size: 16px;
      margin-bottom: 12px;
    }
    .submenu-link {
      font-size: 13px;
      padding: 5px 0;
    }
    .subDropDown {
      gap: 6px;
      margin-top: 10px;
    }
  }

  /* --- لپ‌تاپ کوچک (1100px - 1200px) --- */
  @media (max-width: 1200px) and (min-width: 1101px) {
    .dropdown-menu-edit {
      max-width: 600px;
      padding: 18px;
      border-radius: 16px;
    }
    .dropdown-grid {
      gap: 12px;
    }
    .dropdown-items-edit {
      min-width: 165px;
      padding: 12px 14px;
      border-radius: 12px;
    }
    .dropdown-title {
      font-size: 15px;
      margin-bottom: 12px;
    }
    .submenu-link {
      font-size: 13px;
      padding: 4px 0;
    }
    .subDropDown {
      gap: 6px;
      margin-top: 8px;
    }
  }

  /* --- تبلت (1024px - 1100px) --- */
  @media (max-width: 1100px) and (min-width: 1025px) {
    .dropdown-menu-edit {
      max-width: 560px;
      padding: 16px;
      border-radius: 14px;
    }
    .dropdown-grid {
      gap: 10px;
    }
    .dropdown-items-edit {
      min-width: 155px;
      padding: 10px 12px;
      border-radius: 12px;
    }
    .dropdown-title {
      font-size: 15px;
      margin-bottom: 10px;
    }
    .submenu-link {
      font-size: 12px;
      padding: 4px 0;
    }
    .subDropDown {
      gap: 5px;
      margin-top: 8px;
    }
  }

  /* --- تبلت کوچک (992px - 1024px) --- */
  @media (max-width: 1024px) and (min-width: 993px) {
    .dropdown-menu-edit {
      max-width: 520px;
      padding: 14px;
      border-radius: 14px;
    }
    .dropdown-grid {
      gap: 10px;
    }
    .dropdown-items-edit {
      min-width: 145px;
      padding: 10px 12px;
      border-radius: 10px;
    }
    .dropdown-title {
      font-size: 14px;
      margin-bottom: 10px;
    }
    .dropdown-title::after {
      width: 30px;
    }
    .submenu-link {
      font-size: 12px;
      padding: 3px 0;
    }
    .subDropDown {
      gap: 4px;
      margin-top: 8px;
    }
    .dropdown-menu-edit::before {
      width: 16px;
      height: 16px;
      top: -6px;
    }
  }

  /* --- ریسپانسیو ویژه برای آیتم‌های سمت چپ و راست منو --- */
  /* آیتم‌های سمت چپ منو - دراپ‌داون چپ‌چین */
  .menu-horizontal-item:nth-child(-n+2) .dropdown-menu-edit {
    left: 0;
    transform: translateX(0) translateY(10px);
  }
  .menu-horizontal-item:nth-child(-n+2):hover .dropdown-menu-edit {
    transform: translateX(0) translateY(0);
  }
  .menu-horizontal-item:nth-child(-n+2) .dropdown-menu-edit::before {
    left: 40px;
    transform: rotate(45deg);
  }

  /* آیتم‌های سمت راست منو - دراپ‌داون راست‌چین */
  .menu-horizontal-item:nth-last-child(-n+2) .dropdown-menu-edit {
    left: auto;
    right: 0;
    transform: translateX(0) translateY(10px);
  }
  .menu-horizontal-item:nth-last-child(-n+2):hover .dropdown-menu-edit {
    transform: translateX(0) translateY(0);
  }
  .menu-horizontal-item:nth-last-child(-n+2) .dropdown-menu-edit::before {
    left: auto;
    right: 40px;
    transform: rotate(45deg);
  }

  /* آیتم وسط - دراپ‌داون وسط‌چین (پیش‌فرض) */
  .menu-horizontal-item:nth-child(3):nth-last-child(3) .dropdown-menu-edit,
  .menu-horizontal-item:nth-child(3):nth-last-child(4) .dropdown-menu-edit,
  .menu-horizontal-item:nth-child(4):nth-last-child(3) .dropdown-menu-edit {
    left: 50%;
    transform: translateX(-50%) translateY(10px);
  }
  .menu-horizontal-item:nth-child(3):nth-last-child(3):hover .dropdown-menu-edit,
  .menu-horizontal-item:nth-child(3):nth-last-child(4):hover .dropdown-menu-edit,
  .menu-horizontal-item:nth-child(4):nth-last-child(3):hover .dropdown-menu-edit {
    transform: translateX(-50%) translateY(0);
  }

  /* --- ریسپانسیو برای دراپ‌داون‌های تک‌ستونه (وقتی زیرآیتم‌ها کمه) --- */
  .dropdown-menu-edit:has(.dropdown-items-edit:only-child) {
    min-width: 240px;
  }
  .dropdown-menu-edit:has(.dropdown-items-edit:only-child) .dropdown-grid {
    justify-content: flex-start;
  }

  /* --- انیمیشن نرم‌تر برای دراپ‌داون در صفحات کوچکتر --- */
  @media (max-width: 1400px) {
    .menu-horizontal-item:hover .dropdown-menu-edit {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .dropdown-items-edit:hover {
      transform: translateY(-3px) translateX(-1px);
    }
  }

  /* --- جلوگیری از overflow افقی در کل صفحه --- */
  @media (max-width: 1280px) {
    .dropdown-menu-edit {
      overflow-x: hidden;
      word-wrap: break-word;
    }
    .dropdown-items-edit {
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .submenu-link {
      word-break: break-word;
      overflow-wrap: break-word;
      white-space: normal;
      line-height: 1.5;
    }
  }

  /* --- بهینه‌سازی فلش بالای دراپ‌داون در سایزهای مختلف --- */
  @media (max-width: 1280px) {
    .dropdown-menu-edit::before {
      width: 18px;
      height: 18px;
      top: -7px;
    }
  }

  @media (max-width: 1100px) {
    .dropdown-menu-edit::before {
      width: 16px;
      height: 16px;
      top: -6px;
    }
  }

  /* --- حالت هاور برای تاچ‌اسکرین (تبلت) --- */
  @media (hover: none) and (pointer: coarse) {
    .menu-horizontal-item:hover .dropdown-menu-edit {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    .menu-horizontal-item:active .dropdown-menu-edit,
    .menu-horizontal-item:focus-within .dropdown-menu-edit {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateX(-50%) translateY(0);
    }
    .menu-horizontal-item:nth-child(-n+2):active .dropdown-menu-edit,
    .menu-horizontal-item:nth-child(-n+2):focus-within .dropdown-menu-edit {
      transform: translateX(0) translateY(0);
    }
    .menu-horizontal-item:nth-last-child(-n+2):active .dropdown-menu-edit,
    .menu-horizontal-item:nth-last-child(-n+2):focus-within .dropdown-menu-edit {
      transform: translateX(0) translateY(0);
    }
  }

  /* --- فاصله‌گذاری بهتر بین فلش و آیتم‌ها --- */
  .dropdown-menu-edit {
    margin-top: 2px;
  }

  /* --- بهبود خوانایی زیرمنو در صفحات متوسط --- */
  @media (max-width: 1400px) and (min-width: 993px) {
    .submenu-link {
      line-height: 1.6;
    }
    .dropdown-title {
      line-height: 1.4;
    }
  }

  /* --- ریسپانسیو برای دراپ‌داون با تعداد زیاد زیرآیتم --- */
  .dropdown-menu-edit .dropdown-grid {
    max-height: 60vh;
    overflow-y: auto;
    padding: 4px;
  }

  .dropdown-menu-edit .dropdown-grid::-webkit-scrollbar {
    width: 5px;
  }
  .dropdown-menu-edit .dropdown-grid::-webkit-scrollbar-track {
    background: #f8f8f8;
    border-radius: 10px;
  }
  .dropdown-menu-edit .dropdown-grid::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #880a0a, #ff8c00);
    border-radius: 10px;
  }

  /* --- ریسپانسیو نهایی برای موبایل (زیر 992px) - مخفی کردن کامل --- */
  @media (max-width: 992px) {
    .dropdown-menu-edit {
      display: none !important;
    }
  }
`;

function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const timerRef = useRef(null);

  useEffect(() => {
    if (searchTerm) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const { data } = await axios.get("/api/search", {
            params: { searchTerm, page: 1 },
          });
          setSearchResults(data?.product || []);
          setPage(1);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }, 600);
    } else {
      setSearchResults([]);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [searchTerm]);

  const fetchProducts = async (searchTerm, pageNum = page) => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/search", {
        params: { searchTerm, page: pageNum },
      });
      if (pageNum === 1) {
        setSearchResults(data?.product || []);
      } else {
        setSearchResults((prev) => [...prev, ...(data?.product || [])]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setPage(1);
    if (!term) setSearchResults([]);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearchResults([]);
    setPage(1);
  };

  const loadMore = () => {
    if (!loading && searchResults.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(searchTerm, nextPage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div
        className="search-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="جستجو در کرابو..."
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
            style={{
              width: "100%",
              padding: "14px 50px 14px 50px",
              fontSize: "15px",
              border: "2px solid #880a0a",
              borderRadius: "40px",
              backgroundColor: "#ffffff",
              color: "#2d2d2d",
              outline: "none",
            }}
          />
          <button
            onClick={() => fetchProducts(searchTerm, 1)}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "linear-gradient(135deg, #880a0a, #6b0506)",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FontAwesomeIcon
              icon={faSearch}
              style={{ width: "16px", color: "#fff" }}
            />
          </button>
          {searchTerm && (
            <button
              onClick={handleClear}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#999",
              }}
            >
              <FontAwesomeIcon icon={faTimes} style={{ width: "14px" }} />
            </button>
          )}
        </div>
        {searchResults.length > 0 && (
          <div
            style={{ maxHeight: "400px", overflowY: "auto" }}
            onScroll={(e) => {
              if (
                e.target.scrollHeight - e.target.scrollTop <=
                e.target.clientHeight + 50
              )
                loadMore();
            }}
          >
            {searchResults.map((result) => (
              <div
                key={result.id}
                onClick={() => {
                  router.push(
                    `/product/${result.main_category?.slug}/${result.sub_category?.slug}/${result.slug}/`,
                  );
                  onClose();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  borderBottom: "1px solid #f0f0f0",
                  borderRadius: "8px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fefaf5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fff")
                }
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#f5f0eb",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={`https://python.krabo.gold${result.image}`}
                    alt={result.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#2d2d2d",
                    }}
                  >
                    {result.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#880a0a" }}>
                    {result.main_category?.name}
                  </div>
                </div>
                {result.price && (
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#ff8c00",
                    }}
                  >
                    {new Intl.NumberFormat("fa-IR").format(result.price)} تومان
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ padding: "16px", textAlign: "center" }}>
                در حال بارگذاری...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MobileMenu({ isOpen, onClose, header, isLogin, router }) {
  const [expandedMenu, setExpandedMenu] = useState(null);

  if (!isOpen) return null;

  return (
    <>
      <div className="mobile-menu-overlay" onClick={onClose} />
      <div className="mobile-menu-sidebar">
        <div className="mobile-menu-header">
          <span
            className="logo-text"
            style={{ fontSize: "24px", letterSpacing: "4px" }}
          >
            KRABO
          </span>
          <button className="mobile-menu-close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <ul className="mobile-menu-list">
          {header?.menu?.map((data_menu, index) => (
            <li key={index} className="mobile-menu-item">
              <Link href={data_menu.url}>
                <span
                  className="mobile-menu-link"
                  onClick={() => {
                    if (data_menu.menu_item?.length > 0) {
                      setExpandedMenu(expandedMenu === index ? null : index);
                    } else {
                      onClose();
                    }
                  }}
                >
                  {data_menu.title}
                </span>
              </Link>
              {expandedMenu === index && data_menu.menu_item?.length > 0 && (
                <ul className="mobile-submenu">
                  {data_menu.menu_item.map((menu_title, idx) => (
                    <li key={idx} className="mobile-submenu-item">
                      <div className="mobile-submenu-title">
                        {menu_title.title}
                      </div>
                      {menu_title.item?.map((menu, subIdx) => (
                        <Link key={subIdx} href={menu.url}>
                          <span
                            className="mobile-submenu-link"
                            onClick={onClose}
                          >
                            {menu.name}
                          </span>
                        </Link>
                      ))}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* لینک سبد خرید در موبایل */}
          <li className="mobile-menu-item">
            <Link href="/ShoppingCart">
              <span
                className="mobile-menu-link"
                onClick={onClose}
                style={{ color: "var(--primary)", fontWeight: 600 }}
              >
                🛒 سبد خرید
              </span>
            </Link>
          </li>

          {/* لینک پروفایل در موبایل */}
          {isLogin && (
            <li className="mobile-menu-item">
              <Link href="/profile">
                <span
                  className="mobile-menu-link"
                  onClick={onClose}
                  style={{ color: "var(--primary)", fontWeight: 600 }}
                >
                  👤 پروفایل من
                </span>
              </Link>
            </li>
          )}

          {!isLogin && (
            <li className="mobile-menu-item">
              <span
                className="mobile-menu-link"
                onClick={() => {
                  router.push("/login");
                  onClose();
                }}
                style={{ color: "var(--primary)", fontWeight: 600 }}
              >
                ورود / ثبت نام
              </span>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

const Navbar = ({ navbarRef, header, location, status, searchShow }) => {
  const [goldPrice, setGoldPrice] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [count_card, set_count_card] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const safeHeader = React.useMemo(() => {
    if (!header) return { menu: [] };
    if (header.menu) return header;
    if (header.data?.menu) return header.data;
    return { menu: [] };
  }, [header]);

  async function fetchData() {
    try {
      const token = localStorage.getItem("userInfoKrabo")
        ? JSON.parse(localStorage.getItem("userInfoKrabo")).token
        : null;
      if (!token) return;
      const response = await axios.get(
        "https://python.krabo.gold/api/order/my-card/",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const number = response?.data?.data?.length || 0;
      localStorage.setItem("cartNumber", number);
      set_count_card(number);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  const fetchGoldPrice = async () => {
    try {
      const response = await axios.get(
        "https://python.krabo.gold/api/scrape/get-gold/",
      );
      if (response.data) setGoldPrice(response.data.data);
    } catch (error) {
      console.error("Failed to fetch gold price:", error.message);
    }
  };

  useEffect(() => {
    set_count_card(localStorage.getItem("cartNumber"));
    fetchGoldPrice();
    fetchData();
    setIsLogin(localStorage.getItem("userInfoKrabo"));
    const interval = setInterval(fetchGoldPrice, 300000);
    return () => clearInterval(interval);
  }, []);

  if (!safeHeader.menu || safeHeader.menu.length === 0) {
    console.warn("Navbar: No menu items available");
    return null;
  }

  return (
    <>
      <GlobalStyles />

      <div className="sticky-header">
        <div className="main-header">
          <div className="container">
            <div className="header-top">
              <div className="logo-center">
                <Link href="/">
                  <img
                    src="/assets/img/logo1.png"
                    alt="KRABO"
                    style={{ cursor: "pointer" }}
                  />
                </Link>
              </div>

              <div className="header-icons">
                {/* آیکون سرچ موبایل */}
                <button
                  className="icon-btn search-icon-mobile"
                  onClick={() => setIsSearchOpen(true)}
                  style={{ display: "none" }}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>

                {/* آیکون پروفایل موبایل */}
                {isLogin && (
                  <Link href="/profile">
                    <button
                      className="icon-btn profile-icon-mobile"
                      style={{ display: "none" }}
                    >
                      <FontAwesomeIcon icon={faUser} />
                    </button>
                  </Link>
                )}

                {/* آیکون سبد خرید موبایل */}
                <Link href="/ShoppingCart">
                  <button
                    className="icon-btn cart-icon-mobile"
                    style={{ display: "none", position: "relative" }}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} />
                    {count_card > 0 && (
                      <span className="cart-count">{count_card}</span>
                    )}
                  </button>
                </Link>

                {/* دکمه پروفایل دسکتاپ */}
                {isLogin && (
                  <Link href="/profile">
                    <button
                      className="profile-btn-desktop"
                      style={{
                        background: "transparent",
                        border: "2px solid #880a0a",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        fontWeight: 600,
                        fontSize: "14px",
                        cursor: "pointer",
                        color: "#000",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#880a0a";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#000";
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{ width: "14px" }}
                      />
                      پروفایل
                    </button>
                  </Link>
                )}

                {/* دکمه سبد خرید دسکتاپ */}
                <Link href="/ShoppingCart">
                  <button
                    className="cart-btn-desktop"
                    style={{
                      background: "transparent",
                      border: "2px solid #880a0a",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor: "pointer",
                      color: "#000",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#880a0a";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#000";
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faShoppingCart}
                      style={{ width: "14px" }}
                    />
                    سبد خرید
                    {count_card > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          background: "#880a0a",
                          color: "white",
                          fontSize: "10px",
                          fontWeight: "bold",
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {count_card}
                      </span>
                    )}
                  </button>
                </Link>

                {!isLogin && (
                  <button
                    className="login-btn-desktop"
                    onClick={() => router.push("/login")}
                    style={{
                      background: "transparent",
                      border: "2px solid #880a0a",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor: "pointer",
                      color: "#000",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#880a0a";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#000";
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    ورود
                  </button>
                )}

                <button
                  className="search-btn-desktop"
                  onClick={() => setIsSearchOpen(true)}
                  style={{
                    background: "#880a0a",
                    border: "2px solid #880a0a",
                    padding: "8px 20px",
                    borderRadius: "4px",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: "pointer",
                    color: "#fff",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#880a0a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#880a0a";
                    e.currentTarget.style.color = "#fff";
                  }}
                >
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{ width: "14px", color: "inherit" }}
                  />
                  جستجو
                </button>

                <button
                  className="mobile-menu-btn"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <FontAwesomeIcon icon={faBars} />
                </button>
              </div>

              <div className="gold-price-left">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span className="gold-label-new">قیمت لحظه‌ای طلا</span>
                  <span className="gold-blink"></span>
                </div>
                {goldPrice ? (
                  <div className="gold-value-new">
                    <NumberFormat
                      displayType="text"
                      thousandSeparator={true}
                      value={round(goldPrice / 10, 0)}
                    />{" "}
                    تومان
                  </div>
                ) : (
                  <span className="gold-value-new">در حال دریافت...</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="nav-menu-horizontal">
          <div className="container">
            <ul className="menu-horizontal-list">
              {safeHeader.menu.map((data_menu, index) => (
                <li key={index} className="menu-horizontal-item">
                  <Link href={data_menu.url || "#"}>
                    <span className="menu-horizontal-link">
                      {data_menu.title}
                    </span>
                  </Link>
                  {data_menu.menu_item?.length > 0 && (
                    <div className="dropdown-menu-edit">
                      <div className="dropdown-grid">
                        {data_menu.menu_item.map((menu_title, idx) => (
                          <div key={idx} className="dropdown-items-edit">
                            <div className="dropdown-title">
                              {menu_title.title}
                            </div>
                            <ul className="subDropDown">
                              {menu_title.item?.map((menu, subIdx) => (
                                <li key={subIdx}>
                                  <Link href={menu.url}>
                                    <span className="submenu-link">
                                      {menu.name}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        header={safeHeader}
        isLogin={isLogin}
        router={router}
      />
    </>
  );
};

export default Navbar;