import React, { useState } from 'react';

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [message, setMessage] = useState({ name: '', email: '', context: '' });

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setMessage({ name: '', email: '', context: '' });
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="bg-background text-foreground min-h-screen py-20 px-6 font-sans transition-colors duration-500">
      <div className="max-w-6xl mx-auto animate-fade-in-up">
        
        {/* Header Block */}
        <div className="text-center max-w-xl mx-auto mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-gold/10 rounded-full blur-[60px] pointer-events-none"></div>
          <h1 className="text-4xl font-light tracking-widest uppercase text-foreground relative z-10">
            Contact <span className="font-black text-brand-wine drop-shadow-sm">J2G Hub</span>
          </h1>
          <div className="h-[3px] w-20 bg-brand-wine mx-auto mt-4 mb-5 shadow-[0_0_10px_rgba(122,21,39,0.4)]"></div>
          <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] relative z-10">Get in touch for bespoke orders or delivery routing assistance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* LEFT PANEL: CONTACT METADATA */}
          <div className="lg:col-span-5 space-y-10 bg-card/70 backdrop-blur-xl p-10 border border-border/40 rounded-sm shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-wine/5 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="space-y-3 relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-brand-wine">📍 Showroom Location</h3>
              <p className="text-sm font-black text-foreground tracking-wide">Awoshie - Onyinase</p>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">Accra, Ghana — Directly adjacent to the Onyinase transit terminal hub.</p>
            </div>

            <div className="space-y-3 relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-brand-wine">📞 Instant Dispatch Channels</h3>
              <p className="text-lg font-light tracking-wider text-zinc-900 dark:text-zinc-100">020-1276-727</p>
              <p className="text-lg font-light tracking-wider text-zinc-900 dark:text-zinc-100">054-6666-899</p>
              <div className="pt-4">
                <a 
                  href="https://wa.me/233201276727" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 bg-emerald-600/10 border border-emerald-600/30 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] px-6 py-3 rounded-sm hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm"
                >
                  <span className="text-sm">💬</span> WhatsApp Direct Order
                </a>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-brand-wine">📧 Digital Correspondence</h3>
              <p className="text-sm font-medium text-foreground tracking-wide">orders@j2gapparel.com</p>
              <p className="text-sm font-medium text-foreground tracking-wide">support@j2gapparel.com</p>
            </div>

            <div className="space-y-4 border-t border-zinc-200/50 dark:border-border pt-8 relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">Connect Digitally</h3>
              <div className="flex gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                <a href="#instagram" className="hover:text-brand-wine dark:hover:text-brand-wine transition-colors">Instagram</a>
                <a href="#tiktok" className="hover:text-brand-wine dark:hover:text-brand-wine transition-colors">TikTok</a>
                <a href="#facebook" className="hover:text-brand-wine dark:hover:text-brand-wine transition-colors">Facebook</a>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: MESSAGE SUBMISSION FORM */}
          <div className="lg:col-span-7 bg-input/50 backdrop-blur-md border border-border/40 p-10 rounded-sm shadow-xl relative z-10">
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-foreground border-b border-zinc-200/50 dark:border-border pb-4 mb-8">Send An On-Screen Inquiry</h3>
            
            {formSubmitted && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs p-5 rounded-sm mb-8 tracking-wide uppercase animate-pulse">
                ✨ Message Dispatched! Our support staff will call or email you within 2 business hours.
              </div>
            )}

            <form onSubmit={handleMessageSubmit} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-muted-foreground font-bold uppercase tracking-widest mb-2">Your Name</label>
                  <input type="text" required value={message.name} onChange={(e) => setMessage({ ...message, name: e.target.value })} className="w-full border border-border p-4 rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-white/60 dark:bg-muted/60 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-foreground placeholder:text-muted-foreground" />
                </div>
                <div>
                  <label className="block text-muted-foreground font-bold uppercase tracking-widest mb-2">Email Address</label>
                  <input type="email" required value={message.email} onChange={(e) => setMessage({ ...message, email: e.target.value })} className="w-full border border-border p-4 rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-white/60 dark:bg-muted/60 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-foreground placeholder:text-muted-foreground" />
                </div>
              </div>
              <div>
                <label className="block text-muted-foreground font-bold uppercase tracking-widest mb-2">Detailed Requirements</label>
                <textarea rows="6" required value={message.context} onChange={(e) => setMessage({ ...message, context: e.target.value })} placeholder="State specific apparel sizes or customized delivery guidelines..." className="w-full border border-border p-4 rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-white/60 dark:bg-muted/60 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-foreground placeholder:text-muted-foreground resize-none"></textarea>
              </div>

              <button type="submit" className="w-full bg-[#111] dark:bg-zinc-100 text-background text-[11px] font-black tracking-[0.25em] uppercase py-5 hover:bg-brand-wine dark:hover:bg-brand-wine dark:hover:text-white transition-all duration-300 rounded-sm shadow-xl hover:shadow-[0_0_20px_rgba(122,21,39,0.3)] hover:-translate-y-1 cursor-pointer mt-4">
                Transmit Message Pipeline
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}