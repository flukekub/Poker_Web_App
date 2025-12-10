// middleware.ts
import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    // โค้ดนี้จะรันก็ต่อเมื่อ authorized ผ่านแล้วเท่านั้น
    // คุณสามารถเช็ค Role เพิ่มเติมได้ที่นี่
    // if (req.nextauth.token?.role !== 'admin') { ... }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log("Middleware check token:", token);
        return !!token // ถ้าไม่มี Token ให้ Redirect ไปหน้า Login ทันที
      },
    },
    // กำหนดหน้า Login เอง (ถ้ามี) เพื่อกัน Loop
    pages: {
      signIn: '/auth/signin', 
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) -> แนะนำให้ปล่อยผ่าน แล้วไปเช็ค getServerSession ข้างใน
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page) -> ต้องปล่อย login ด้วย ไม่งั้น Loop ตาย
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|auth|$).*)",
  ],
}