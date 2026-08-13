import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Cart from "@/models/Cart";
import crypto from "crypto";

function getOrCreateSessionId(req: NextRequest) {
  let sessionId = req.cookies.get("cart_session")?.value;
  let isNew = false;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    isNew = true;
  }
  return { sessionId, isNew };
}

function setSessionCookie(response: NextResponse, sessionId: string) {
  response.cookies.set("cart_session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const sessionId = req.cookies.get("cart_session")?.value;
    if (!sessionId) {
      return NextResponse.json({ success: true, cart: [] });
    }
    const cart = await Cart.findOne({ sessionId }).lean();
    return NextResponse.json({ success: true, cart: cart?.items || [] });
  } catch (error: any) {
    console.error("GET Cart API error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { sessionId, isNew } = getOrCreateSessionId(req);
    const body = await req.json();
    const { productId, name, price, image, scale, color, quantity = 1, maxStock } = body;

    if (!productId || !name || price === undefined) {
      return NextResponse.json({ success: false, message: "Missing item details" }, { status: 400 });
    }

    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }

    const existingItemIdx = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIdx > -1) {
      cart.items[existingItemIdx].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        name,
        price,
        image,
        scale,
        color,
        quantity,
        maxStock,
      });
    }

    await cart.save();

    const response = NextResponse.json({ success: true, cart: cart.items });
    if (isNew) {
      setSessionCookie(response, sessionId);
    }
    return response;
  } catch (error: any) {
    console.error("POST Cart API error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const sessionId = req.cookies.get("cart_session")?.value;
    if (!sessionId) {
      return NextResponse.json({ success: false, message: "No active cart session" }, { status: 400 });
    }

    const { productId, quantity } = await req.json();
    if (!productId || quantity === undefined) {
      return NextResponse.json({ success: false, message: "Missing update details" }, { status: 400 });
    }

    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });
    }

    const itemIdx = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIdx > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIdx, 1);
      } else {
        cart.items[itemIdx].quantity = quantity;
      }
      await cart.save();
    }

    return NextResponse.json({ success: true, cart: cart.items });
  } catch (error: any) {
    console.error("PUT Cart API error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const sessionId = req.cookies.get("cart_session")?.value;
    if (!sessionId) {
      return NextResponse.json({ success: true, cart: [] });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return NextResponse.json({ success: true, cart: [] });
    }

    if (productId) {
      cart.items = cart.items.filter(
        (item) => item.productId !== productId
      );
      await cart.save();
    } else {
      // Clear entire cart
      await Cart.deleteOne({ sessionId });
      const response = NextResponse.json({ success: true, cart: [] });
      response.cookies.delete("cart_session");
      return response;
    }

    return NextResponse.json({ success: true, cart: cart.items });
  } catch (error: any) {
    console.error("DELETE Cart API error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
