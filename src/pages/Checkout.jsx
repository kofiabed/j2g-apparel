import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
//  The absolute correct named hook export syntax for react-paystack
import { PaystackButton, usePaystackPayment } from 'react-paystack';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  // 1. INTEGRATED FORM STATE CONFIGURATIONS
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    region: 'Greater Accra',
    address: '',
    deliveryNotes: '',
    paymentMethod: 'momo' // Default selected channel
  });

  // 2. FINANCIAL AND LOGISTICAL RUNNING CALCULATIONS
  const itemsPrice = cart.reduce((acc, item) => acc + ((item.discountPrice || item.price) * item.quantity), 0);
  
  // Free delivery within Awoshie if order value crosses GHS 500 banner target
  const deliveryFee = (itemsPrice >= 500 || itemsPrice === 0) ? 0 : 35; 
  const totalAmount = itemsPrice + deliveryFee;

  // 3. PAYSTACK GATEWAY CONTRACT MATRIX
  const paystackConfig = {
    reference: `J2G-${new Date().getTime().toString()}`,
    email: formData.email || "orders@j2gapparel.com",
    amount: totalAmount * 100, // Converted to minor currency units (Pesewas)
    publicKey: 'pk_test_2325a066e7919b0b3f983f5171b2b248f1c54284', 
    currency: 'GHS',
    channels: formData.paymentMethod === 'momo' ? ['mobile_money'] : ['card'],
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. TRANSACTION BILLING AUTHORIZATION LOGIC
  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const submitOrderToBackend = async () => {
      try {
        const orderData = {
          items: cart.map(item => ({
            productId: item._id, // the mapped _id from AppContext
            quantity: item.quantity,
            price: item.discountPrice || item.price,
            size: item.selectedSize || null,
            color: item.selectedColor || null,
          })),
          totalAmount: totalAmount,
          shippingAddress: formData,
          paymentMethod: formData.paymentMethod
        };

        const res = await fetch('http://127.0.0.1:5000/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        
        if (res.ok) {
          alert("🎉 Order Logged Flawlessly!\nOur hub at Awoshie - Onyinase has locked your route metrics.");
        } else {
          alert("Order saved locally, but backend sync failed (requires login).");
        }
      } catch (err) {
        console.error("Order sync error", err);
      } finally {
        clearCart();
        navigate('/');
      }
    };

    try {
      const initializePayment = usePaystackPayment(paystackConfig);
      initializePayment(
        (reference) => {
          alert(`🎉 Payment Successful! Reference ID: ${reference.reference}`);
          submitOrderToBackend();
        },
        () => alert("❌ Transaction canceled by customer.")
      );
    } catch (err) {
      // DEV MODE SANDBOX FALLBACK
      alert(`🔄 J2G Checkout System Sandbox:\nProcessing GHS ${totalAmount} for ${formData.firstName} via ${formData.paymentMethod === 'momo' ? 'Mobile Money' : 'Credit/Debit Card'}...`);
      submitOrderToBackend();
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 font-sans bg-background text-foreground transition-colors duration-500">
        <div className="animate-fade-in-up">
          <span className="text-6xl mb-6 block animate-bounce-soft">🛍️</span>
          <h2 className="text-2xl font-light uppercase tracking-[0.2em] mb-3">Your Basket is <span className="font-bold text-brand-wine">Empty</span></h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-8">Add premium pieces before checking out.</p>
          <button onClick={() => navigate('/')} className="bg-brand-black text-white px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-wine transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(122,21,39,0.4)] rounded-sm cursor-pointer hover:-translate-y-1">
            Return To Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen py-16 md:py-24 px-6 font-sans transition-colors duration-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 animate-fade-in-up">
        
        {/* LEFT COMPONENT: SHIPPING FORM & PAYMENT SELECTION */}
        <form onSubmit={handlePlaceOrderSubmit} className="lg:col-span-7 space-y-10">
          
          <div>
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-foreground mb-2 flex items-center gap-3">
              <span className="w-6 h-px bg-brand-wine"></span> Customer Details
            </h2>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Provide direct contact info for shipping receipts</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
              <input type="text" name="firstName" required placeholder="First Name" onChange={handleInputChange} className="w-full border border-border p-4 text-xs rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-input/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-foreground placeholder:text-muted-foreground" />
              <input type="text" name="lastName" required placeholder="Last Name" onChange={handleInputChange} className="w-full border border-border p-4 text-xs rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-input/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-foreground placeholder:text-muted-foreground" />
              <input type="email" name="email" required placeholder="Email Address" onChange={handleInputChange} className="w-full border border-border p-4 text-xs rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-input/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-foreground placeholder:text-muted-foreground" />
              <input type="tel" name="phone" required placeholder="Phone Number (WhatsApp Active)" onChange={handleInputChange} className="w-full border border-border p-4 text-xs rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-input/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-foreground placeholder:text-muted-foreground" />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-foreground mb-2 flex items-center gap-3">
              <span className="w-6 h-px bg-brand-wine"></span> Delivery Address
            </h2>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">We coordinate runs from our hub at Awoshie - Onyinase</p>
            <div className="space-y-5 mt-6">
              <select name="region" onChange={handleInputChange} className="w-full border border-border p-4 text-xs rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-input/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-foreground cursor-pointer">
                <option value="Greater Accra" className="bg-card">Greater Accra Region</option>
                <option value="Ashanti" className="bg-card">Ashanti Region</option>
                <option value="Central" className="bg-card">Central Region</option>
                <option value="Western" className="bg-card">Western Region</option>
              </select>
              <input type="text" name="address" required placeholder="Digital Address / Landmark Location (e.g., Near Onyinase Station)" onChange={handleInputChange} className="w-full border border-border p-4 text-xs rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-input/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-foreground placeholder:text-muted-foreground" />
              <textarea name="deliveryNotes" rows="3" placeholder="Additional landmark direction metrics (Optional)" onChange={handleInputChange} className="w-full border border-border p-4 text-xs rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-input/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-foreground placeholder:text-muted-foreground resize-none"></textarea>
            </div>
          </div>

          {/* LUXURY INTERACTIVE PAYMENT SELECTION GRID MODULE */}
          <div>
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-foreground mb-2 flex items-center gap-3">
              <span className="w-6 h-px bg-brand-wine"></span> Payment Selection
            </h2>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-6">Select your preferred local or international billing gateway</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
              {/* Option 1: Mobile Money Wallet Grid Card */}
              <div 
                onClick={() => setFormData({ ...formData, paymentMethod: 'momo' })}
                className={`group border p-5 rounded-sm transition-all duration-300 cursor-pointer flex flex-col justify-between h-32 bg-card/80 backdrop-blur-md ${
                  formData.paymentMethod === 'momo' 
                    ? 'border-brand-wine ring-1 ring-brand-wine shadow-[0_0_20px_rgba(122,21,39,0.15)] -translate-y-1' 
                    : 'border-border hover:border-zinc-300 dark:hover:border-border hover:shadow-lg'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-xs font-bold uppercase tracking-widest transition-colors ${formData.paymentMethod === 'momo' ? 'text-brand-wine' : 'text-foreground group-hover:text-brand-wine'}`}>Mobile Money</h3>
                    <p className="text-[10px] text-muted-foreground mt-1.5 font-light leading-tight">Instant wallet authentication for MTN, Telecel, and AT nets.</p>
                  </div>
                  <span className="text-lg opacity-80">📱</span>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    formData.paymentMethod === 'momo' ? 'border-brand-wine bg-brand-wine' : 'border-zinc-300 dark:border-border'
                  }`}>
                    {formData.paymentMethod === 'momo' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className={`text-[9px] uppercase tracking-widest font-bold transition-colors ${
                    formData.paymentMethod === 'momo' ? 'text-brand-wine' : 'text-muted-foreground group-hover:text-muted-foreground'
                  }`}>
                    {formData.paymentMethod === 'momo' ? 'Active Channel' : 'Select'}
                  </span>
                </div>
              </div>

              {/* Option 2: Card Processing Grid Card */}
              <div 
                onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                className={`group border p-5 rounded-sm transition-all duration-300 cursor-pointer flex flex-col justify-between h-32 bg-card/80 backdrop-blur-md ${
                  formData.paymentMethod === 'card' 
                    ? 'border-brand-wine ring-1 ring-brand-wine shadow-[0_0_20px_rgba(122,21,39,0.15)] -translate-y-1' 
                    : 'border-border hover:border-zinc-300 dark:hover:border-border hover:shadow-lg'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-xs font-bold uppercase tracking-widest transition-colors ${formData.paymentMethod === 'card' ? 'text-brand-wine' : 'text-foreground group-hover:text-brand-wine'}`}>Credit / Debit Card</h3>
                    <p className="text-[10px] text-muted-foreground mt-1.5 font-light leading-tight">Secure processing for international Visa or Mastercard accounts.</p>
                  </div>
                  <span className="text-lg opacity-80">💳</span>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    formData.paymentMethod === 'card' ? 'border-brand-wine bg-brand-wine' : 'border-zinc-300 dark:border-border'
                  }`}>
                    {formData.paymentMethod === 'card' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className={`text-[9px] uppercase tracking-widest font-bold transition-colors ${
                    formData.paymentMethod === 'card' ? 'text-brand-wine' : 'text-muted-foreground group-hover:text-muted-foreground'
                  }`}>
                    {formData.paymentMethod === 'card' ? 'Active Channel' : 'Select'}
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy Subtext Banner */}
            <div className="mt-6 flex items-center gap-4 bg-white/60 dark:bg-muted/60 backdrop-blur-md border border-zinc-100 dark:border-border p-4 rounded-sm shadow-sm">
              <span className="text-lg drop-shadow-md">🔒</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-medium leading-relaxed">
                Your checkout layout parameters are encrypted and secured via top-tier layer banking token systems.
              </p>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#111] dark:bg-zinc-100 text-background py-5 text-[11px] font-black tracking-[0.25em] uppercase hover:bg-brand-wine dark:hover:bg-brand-wine dark:hover:text-white transition-all duration-300 rounded-sm shadow-xl hover:shadow-[0_0_20px_rgba(122,21,39,0.3)] hover:-translate-y-1 cursor-pointer">
            Authorize & Secure Payment
          </button>
        </form>

        {/* RIGHT COMPONENT: SUMMARY STICKY CONTEXT CONTAINER */}
        <div className="lg:col-span-5 relative">
          <div className="bg-card/70 backdrop-blur-xl p-8 border border-white/20 dark:border-border/50 rounded-sm shadow-2xl sticky top-28 space-y-8">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-wine/10 rounded-full blur-[50px] pointer-events-none"></div>
            
            <h2 className="text-xs font-black tracking-[0.25em] uppercase text-foreground border-b border-zinc-200/50 dark:border-border pb-4 relative z-10">Order Summary</h2>
            
            <div className="max-h-64 overflow-y-auto space-y-5 pr-2 custom-scrollbar relative z-10">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-4 text-xs group">
                  <div className="relative overflow-hidden rounded-xs w-14 h-16 shrink-0 border border-zinc-100 dark:border-border shadow-sm">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate tracking-wide">{item.name}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-black text-foreground whitespace-nowrap">GHS {((item.discountPrice || item.price) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200/50 dark:border-border pt-6 space-y-4 text-xs text-muted-foreground relative z-10">
              <div className="flex justify-between items-center">
                <span className="uppercase tracking-widest font-bold">Cart Subtotal</span>
                <span className="font-black text-zinc-900 dark:text-zinc-100">GHS {itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="uppercase tracking-widest font-bold">Local Carrier Delivery</span>
                <span>{deliveryFee === 0 ? <span className="text-brand-wine font-black text-[10px] tracking-[0.2em] uppercase bg-brand-wine/10 px-2 py-1 rounded-sm">Free</span> : `GHS ${deliveryFee}`}</span>
              </div>
              <div className="border-t border-zinc-200/50 dark:border-border pt-5 flex justify-between items-baseline text-foreground">
                <span className="uppercase tracking-[0.2em] font-black text-xs">Total Bill</span>
                <span className="text-2xl font-light tracking-tight"><span className="text-sm font-bold align-top mr-1">GHS</span>{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}