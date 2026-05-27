# Product Requirements Document (PRD) - P&P Lucky Spin

## 1. Overview
**P&P Lucky Spin** is an interactive, full-stack web application built for the **Vietnam Labour Forum 2026** by Phuoc & Partners (P&P). The application facilitates lead generation and engagement through a lucky spin wheel game at the event's interactive booth. 

## 2. Tech Stack
* **Frontend**: React 19, React Router, TailwindCSS.
* **Backend**: Node.js, Express.js.
* **Bundler & Tooling**: Vite, esbuild, TypeScript.

## 3. Core Features

### 3.1. Splash Screen
* Introductory screen displaying the "Phuoc & Partners" logo and event title ("Vietnam Labour Forum 2026").
* "QUAY NGAY" button to proceed to the registration form.

### 3.2. Data Collection (Form Page)
* **Lead Capture**: Collects users' details: 
    * "Họ và tên" (Full Name)
    * "Số điện thoại" (Phone Number)
    * "Email"
    * "Tên công ty" (Company Name)
* **Validation**: Checks for existing phone numbers to prevent duplicate entries (calls `/api/check-phone`).
* **Visuals**: Displays glowing input fields and an immersive background.

### 3.3. Spin Wheel
* **Greeting**: Welcomes the user with a customized greeting (`Chào <tên_người_chơi>`).
* **Wheel Mechanics**: Fully interactive, smooth spin animation resolving to a specific prize via the `/api/spin` backend endpoint.
* **Prize Sequence & Inventory Control**: 
    * "Tag hành lý" (Luggage tag).
    * "Sổ tay P&P" (Notebook).
    * "Combo nhân sự" (HR Combo - acts as unlimited fallback).
    * Backend manages the prize queue sequence and automatically decrements limited inventory items.
    * Fallback mechanism issues "Combo nhân sự" if a limited item runs out of stock.
* **Real-time Inventory UI**: Displays the remaining counts for "Tag hành lý" and "Sổ tay P&P" below the wheel ("Phần thưởng còn lại").

### 3.4. Result Page
* Congratulates the user with a confetti animation. 
* Displays the specific prize won clearly.
* Instructs the user to claim the prize at the booth.
* Action button to return to the Splash page and clear session data, preparing the setup for the next visitor.

## 4. API Endpoints (Backend)
- `POST /api/check-phone`: Validates non-duplicate phone numbers before allowing spin access.
- `POST /api/spin`: Registers the user lead, resolves the spin prize asynchronously, decrements inventory stock appropriately.
- `GET /api/inventory`: Fetches the current snapshot of remaining limited-prize items.
- `GET /api/leads`: Protected/debug route returning all captured leads.
- `POST /api/reset`: Resets all leads and local data (useful for dev and testing).

## 5. Visual Identity & Instructions
* **Theme**: Deep, modern slate-blue (`#15b0f8` brand accents) with white text formatting suitable for dark environments and digital booths.
* **Logos**: Utilizes custom provided "Phuoc & Partners" vector component representations.
