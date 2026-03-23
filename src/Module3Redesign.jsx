import React from 'react';
import './Module3Stitch.css';

export function PageListProjectsStitch() {
  return (
    <div className="stitch-page relative w-full h-[800px] overflow-hidden overflow-y-auto rounded-xl border border-outline-variant/30 shadow-2xl bg-[#0e0e0e]" style={{ isolation: 'isolate' }}>
      
{/*  TopNavBar  */}
<header className="absolute top-0 w-full z-50 bg-[#0e0e0e]/60 backdrop-blur-xl shadow-[0px_20px_40px_rgba(199,153,255,0.04)]">
<div className="flex justify-between items-center px-8 py-4 w-full">
<div className="flex items-center gap-8">
<span className="text-2xl font-bold tracking-tighter text-[#c799ff] font-['Epilogue']">Obsidian</span>
<nav className="hidden md:flex gap-6 items-center">
<a className="text-[#c799ff] font-bold border-b-2 border-[#c799ff] font-['Epilogue'] tracking-tight" href="#">Gallery</a>
<a className="text-gray-400 font-medium hover:text-white transition-colors duration-300 font-['Epilogue'] tracking-tight" href="#">Resources</a>
<a className="text-gray-400 font-medium hover:text-white transition-colors duration-300 font-['Epilogue'] tracking-tight" href="#">Marketplace</a>
</nav>
</div>
<div className="flex items-center gap-6">
<div className="relative hidden lg:block">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" data-icon="search">search</span>
<input className="bg-surface-container-highest/40 border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/50" placeholder="Search projects..." type="text"/>
</div>
<div className="flex items-center gap-4">
<button className="text-gray-400 hover:text-white transition-colors duration-300">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button className="text-gray-400 hover:text-white transition-colors duration-300">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
</button>
<div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/20">
<img alt="User profile avatar" className="w-full h-full object-cover" data-alt="Close up of a professional male avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGrd5isKMnEV_mZgFIjjVuml1behLFm9yBXuNtCE9_O5jw5OnjPpIyWuffZrwD7WAhO5-Ii42xZVq91oo3KPEEOAVVcMyfklcNPdkVv1QzSrWPphH2hhpS9yrD4yG8svtHLfxqT6h6FoRvM8fXxXIvzhAxR3Q5exEZxwHNk1zOntR9fIgTcsnQ7WFOlAXzxDbNGgIsNXD51R6u_7Qo3aCH2y016q3_f86O7K3oKYgXuTdozLho_ec_zdnNksO7juZ2yu9WL6yCu-A"/>
</div>
</div>
</div>
</div>
<div className="bg-gradient-to-b from-[#1a1a1a] to-transparent h-px w-full opacity-20"></div>
</header>
{/*  SideNavBar  */}
<aside className="h-full min-h-[800px] w-64 absolute left-0 top-0 z-40 bg-[#131313] hidden md:flex flex-col py-8 px-4">
<div className="mb-10 px-4">
<div className="flex items-center gap-3 mb-1">
<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary text-xl" data-icon="polymer" data-weight="fill" style={{fontVariationSettings: `'FILL' 1`}}>polymer</span>
</div>
<h2 className="text-lg font-black text-white font-['Manrope']">Project Alpha</h2>
</div>
<p className="text-xs text-gray-500 font-['Manrope']">Enterprise Tier</p>
</div>
<nav className="flex-1 space-y-1">
<a className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#c799ff]/10 to-transparent text-[#c799ff] border-l-4 border-[#c799ff] font-['Manrope'] text-sm font-medium" href="#">
<span className="material-symbols-outlined" data-icon="grid_view">grid_view</span>
                Gallery
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-[#1a1a1a] hover:text-white transition-all font-['Manrope'] text-sm font-medium" href="#">
<span className="material-symbols-outlined" data-icon="insights">insights</span>
                Analytics
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-[#1a1a1a] hover:text-white transition-all font-['Manrope'] text-sm font-medium" href="#">
<span className="material-symbols-outlined" data-icon="group">group</span>
                Teams
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-[#1a1a1a] hover:text-white transition-all font-['Manrope'] text-sm font-medium" href="#">
<span className="material-symbols-outlined" data-icon="folder_open">folder_open</span>
                Assets
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-[#1a1a1a] hover:text-white transition-all font-['Manrope'] text-sm font-medium" href="#">
<span className="material-symbols-outlined" data-icon="tune">tune</span>
                Settings
            </a>
</nav>
<div className="mt-auto pt-6 border-t border-[#1a1a1a] space-y-1">
<button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-[#1a1a1a] hover:text-white transition-all font-['Manrope'] text-sm font-medium">
<span className="material-symbols-outlined" data-icon="help_outline">help_outline</span>
                Support
            </button>
<button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-[#1a1a1a] hover:text-white transition-all font-['Manrope'] text-sm font-medium">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
                Logout
            </button>
</div>
</aside>
{/*  Main Canvas  */}
<main className="md:pl-64 pt-20 min-h-full min-h-[800px]">
<div className="max-w-[1600px] mx-auto p-8 lg:p-12">
{/*  Hero Header  */}
<header className="mb-12">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
<div>
<span className="font-label text-primary tracking-widest text-xs uppercase mb-2 block">Curation Workspace</span>
<h1 className="font-headline text-5xl font-extrabold tracking-tighter mb-4">Project Gallery</h1>
<p className="font-body text-on-surface-variant max-w-xl text-lg leading-relaxed">
                            Manage and orchestrate your digital assets within the Obsidian ecosystem. Curate, build, and deploy with precision.
                        </p>
</div>
<button className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold shadow-lg shadow-primary/20 hover:scale-95 transition-all">
<span className="material-symbols-outlined" data-icon="add">add</span>
                        Create New Project
                    </button>
</div>
</header>
{/*  Bento Grid  */}
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[240px]">
{/*  Main Featured Card (Asymmetry)  */}
<div className="md:col-span-2 md:row-span-2 glass-card rounded-2xl p-8 flex flex-col justify-between group relative overflow-hidden neon-glow-primary border border-white/5">
<div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
<div className="relative z-10 flex justify-between items-start">
<div>
<span className="font-label text-[10px] text-secondary font-medium px-2 py-1 bg-secondary/10 rounded-full border border-secondary/20">LIVE PROJECT</span>
<h3 className="font-headline text-3xl font-bold mt-4 tracking-tight">Obsidian Core 2.0</h3>
</div>
<span className="material-symbols-outlined text-primary text-3xl" data-icon="auto_awesome" data-weight="fill" style={{fontVariationSettings: `'FILL' 1`}}>auto_awesome</span>
</div>
<div className="relative z-10">
<div className="flex -space-x-3 mb-6">
<img alt="Team member" className="w-10 h-10 rounded-full border-2 border-surface" data-alt="Portrait of a woman" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL3trJOvCl5-9Wnic5p3sCdtjYR5mT-1DLtEp_EqybaJVHZwrQbBPxjE_KN4BPX723Ck7XSujvP93IJOHi5HJlkuI693Bgg6rJ1youdb5QbBch4T02njZ47O-_PNrgCn4aRQkjH6bkneGjuJ0iRYT23HQlnFnK0xUKhCKSE7AqG7JXPH7F_WGn7SrnRpVa8e7kxud1krWGQDdbFSMmvYlasbdpbfBs2BeYvQ2lWvW8Fo8AlK66EpmLHEanYikf3HEp8MisRziXdrw"/>
<img alt="Team member" className="w-10 h-10 rounded-full border-2 border-surface" data-alt="Portrait of a man with glasses" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHekpbjl2tPplk85nqnu4dmljQ45WY71Jrn1rqTd5xxr_ClhnmbPmPJuyLZ_mdU_4xivCZi0ISA6Ffs4Hs1Rvz2rW-N16X3dUCE1f0n6v4npJbdKUtpVwJ00Tnzjiq5kBAERKy6H7_Rghq8uE93lK8dEbQoNQETutikB6a8chCVwYi6z2VdQ0__oFgsR1D77z3DizXfOvlIeiQa5dSwpgFVpjLq2GDgMqx3Id_Q38o99ekqU2_W-UsIBR419IwOFrar3X9MsQC4FU"/>
<div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-xs font-label">+4</div>
</div>
<div className="flex items-center justify-between">
<div>
<p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">Last Modified</p>
<p className="text-on-surface font-medium">12 mins ago</p>
</div>
<button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
<span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
</div>
{/*  Secondary Card  */}
<div className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-white/5 hover:bg-surface-container transition-all">
<div>
<div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center mb-4">
<span className="material-symbols-outlined text-tertiary" data-icon="analytics">analytics</span>
</div>
<h3 className="font-headline text-xl font-bold tracking-tight">Market Analytics</h3>
<p className="font-body text-sm text-on-surface-variant mt-2">Internal tracking dashboard</p>
</div>
<div className="flex items-center justify-between text-xs font-label text-on-surface-variant pt-4">
<span>Updated yesterday</span>
<span className="text-tertiary">Draft</span>
</div>
</div>
{/*  Create New Placeholder  */}
<div className="rounded-2xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all cursor-pointer group">
<div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary/20 transition-all">
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-all" data-icon="add">add</span>
</div>
<span className="font-label text-sm text-on-surface-variant group-hover:text-primary">Quick Draft</span>
</div>
{/*  Timeline Sidebar (Integrated into Bento)  */}
<div className="md:row-span-2 lg:col-span-1 glass-card rounded-2xl p-6 border border-white/5 overflow-hidden flex flex-col">
<h4 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-xl" data-icon="history">history</span>
                        Recent Activity
                    </h4>
<div className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
{/*  Timeline Item  */}
<div className="relative pl-6">
<div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-tertiary"></div>
<div className="absolute left-[3px] top-4 bottom-[-24px] w-px bg-surface-variant"></div>
<p className="text-xs font-label text-tertiary mb-1">2m ago</p>
<p className="text-sm font-body text-on-surface leading-tight">Sarah updated <span className="text-primary">Styles</span> in Mobile App</p>
</div>
{/*  Timeline Item  */}
<div className="relative pl-6">
<div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-surface-variant"></div>
<div className="absolute left-[3px] top-4 bottom-[-24px] w-px bg-surface-variant"></div>
<p className="text-xs font-label text-on-surface-variant mb-1">1h ago</p>
<p className="text-sm font-body text-on-surface leading-tight">API endpoint <span className="text-on-surface-variant">/auth/v2</span> deployed</p>
</div>
{/*  Timeline Item  */}
<div className="relative pl-6">
<div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-surface-variant"></div>
<div className="absolute left-[3px] top-4 bottom-[-24px] w-px bg-surface-variant"></div>
<p className="text-xs font-label text-on-surface-variant mb-1">5h ago</p>
<p className="text-sm font-body text-on-surface leading-tight">New asset library <span className="text-primary">Vector-UI</span> added</p>
</div>
{/*  Timeline Item  */}
<div className="relative pl-6">
<div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-surface-variant"></div>
<p className="text-xs font-label text-on-surface-variant mb-1">Yesterday</p>
<p className="text-sm font-body text-on-surface leading-tight">Project <span className="text-secondary">Alpha v1.2</span> archived</p>
</div>
</div>
</div>
{/*  Third Card  */}
<div className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-white/5 hover:bg-surface-container transition-all">
<div>
<div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
<span className="material-symbols-outlined text-secondary" data-icon="cloud_queue">cloud_queue</span>
</div>
<h3 className="font-headline text-xl font-bold tracking-tight">Cloud Sync</h3>
<p className="font-body text-sm text-on-surface-variant mt-2">Automated backup systems</p>
</div>
<div className="flex items-center justify-between text-xs font-label text-on-surface-variant pt-4">
<span>12 Mar 2024</span>
<span className="text-secondary">Active</span>
</div>
</div>
{/*  Fourth Card  */}
<div className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-white/5 hover:bg-surface-container transition-all lg:col-span-2">
<div className="flex justify-between items-start">
<div>
<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
<span className="material-symbols-outlined text-primary" data-icon="shield">shield</span>
</div>
<h3 className="font-headline text-xl font-bold tracking-tight">Security Protocol</h3>
<p className="font-body text-sm text-on-surface-variant mt-2">Advanced encryption and access control for enterprise assets.</p>
</div>
<div className="bg-surface-container-highest px-3 py-1 rounded-lg text-[10px] font-label font-bold text-primary">ENCRYPTED</div>
</div>
<div className="flex items-center gap-4 text-xs font-label text-on-surface-variant pt-4">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm" data-icon="verified_user">verified_user</span> Verified</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm" data-icon="lock_clock">lock_clock</span> Updated monthly</span>
</div>
</div>
</div>
</div>
</main>
{/*  BottomNavBar (Mobile only)  */}
<nav className="md:hidden absolute bottom-0 left-0 w-full bg-[#0e0e0e]/80 backdrop-blur-xl border-t border-white/5 z-50 px-6 py-3">
<div className="flex justify-between items-center">
<a className="flex flex-col items-center gap-1 text-primary" href="#">
<span className="material-symbols-outlined" data-icon="grid_view" data-weight="fill" style={{fontVariationSettings: `'FILL' 1`}}>grid_view</span>
<span className="text-[10px] font-label">Gallery</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined" data-icon="insights">insights</span>
<span className="text-[10px] font-label">Stats</span>
</a>
<div className="bg-primary p-3 rounded-full -mt-10 shadow-lg shadow-primary/30">
<span className="material-symbols-outlined text-on-primary" data-icon="add">add</span>
</div>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined" data-icon="folder_open">folder_open</span>
<span className="text-[10px] font-label">Assets</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined" data-icon="tune">tune</span>
<span className="text-[10px] font-label">Config</span>
</a>
</div>
</nav>
{/*  Background Decorative Glows  */}
<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full z-[-1] pointer-events-none"></div>
<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full z-[-1] pointer-events-none"></div>

    </div>
  );
}

export function PageWhatIsProjectStitch() {
  return (
    <div className="stitch-page relative w-full h-[800px] overflow-hidden overflow-y-auto rounded-xl border border-outline-variant/30 shadow-2xl bg-[#0e0e0e]" style={{ isolation: 'isolate' }}>
      
{/*  TopNavBar  */}
<header className="absolute top-0 w-full h-16 flex items-center justify-between px-8 bg-[#131314]/60 backdrop-blur-xl z-50 shadow-[0_88px_88px_rgba(229,226,227,0.04)]">
<div className="flex items-center gap-8">
<span className="text-2xl font-bold tracking-tighter text-[#00f0ff] font-headline">Obsidian Gallery</span>
<nav className="hidden md:flex items-center gap-6">
<a className="text-on-surface-variant hover:text-on-surface transition-colors font-body text-sm tracking-wide" href="#">Showcase</a>
<a className="text-on-surface-variant hover:text-on-surface transition-colors font-body text-sm tracking-wide" href="#">Resources</a>
<a className="text-on-surface-variant hover:text-on-surface transition-colors font-body text-sm tracking-wide" href="#">Docs</a>
</nav>
</div>
<div className="flex items-center gap-4">
<div className="relative hidden lg:block">
<span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-sm">search</span>
<input className="bg-surface-container-lowest border-none rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:ring-1 focus:ring-primary-container/40" placeholder="Search system..." type="text"/>
</div>
<button className="material-symbols-outlined text-on-surface-variant hover:bg-white/5 p-2 rounded-full transition-all active:scale-95">notifications</button>
<div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant/20">
<img alt="User Profile" className="w-full h-full object-cover" data-alt="Professional user profile headshot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaX9-OFlz6yWXWN2juzSMZ2UK7VTqMbMoDYeOqVvCk5XWiw_Q8SZiDgOXe5KsiV5wxuug6usKKjkqeR8w2QvrroeQ-UD4bXamC0HPYFq_6xVv1tHM6A90YdKSWA4J4EExn9uTDoVbN-LPUzVFS4J1P89ELcDSj1g469Lbnp1Vm_M4RUYgwJKkTPxz3l4R5unwYbXo4SkYnjpqLjf-RiDgnt8sPWFkAL6q_JMMPXR59pv1wRCCML0N_R7zOahtDnQbQe9-Qv2XV5_0"/>
</div>
</div>
</header>
{/*  SideNavBar  */}
<aside className="absolute left-0 top-16 h-[calc(100vh-64px)] w-64 bg-[#131314] border-r border-white/5 flex flex-col py-6 gap-2 z-40">
<div className="px-6 mb-8">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded bg-primary-container/10 flex items-center justify-center">
<span className="material-symbols-outlined text-primary-container">deployed_code</span>
</div>
<div>
<p className="font-headline text-sm font-bold text-on-surface leading-none">System Core</p>
<p className="font-body text-xs text-on-surface-variant">Precision Engine</p>
</div>
</div>
</div>
<nav className="flex flex-col gap-1">
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg mx-2 hover:translate-x-1 transition-all" href="#">
<span className="material-symbols-outlined">info</span>
<span className="font-body text-sm font-medium tracking-wide">Introduction</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg mx-2 hover:translate-x-1 transition-all" href="#">
<span className="material-symbols-outlined">settings</span>
<span className="font-body text-sm font-medium tracking-wide">Setup Phase</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg mx-2 hover:translate-x-1 transition-all" href="#">
<span className="material-symbols-outlined">architecture</span>
<span className="font-body text-sm font-medium tracking-wide">Design Principles</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 bg-surface-container-high text-[#00f0ff] rounded-lg mx-2 active:opacity-80" href="#">
<span className="material-symbols-outlined">code</span>
<span className="font-body text-sm font-medium tracking-wide">Implementation</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg mx-2 hover:translate-x-1 transition-all" href="#">
<span className="material-symbols-outlined">verified</span>
<span className="font-body text-sm font-medium tracking-wide">Final Review</span>
</a>
</nav>
</aside>
{/*  Main Content Canvas  */}
<main className="ml-64 mt-16 p-8 min-h-[calc(100vh-64px)] bg-surface flex flex-col gap-8">
{/*  Header Section  */}
<header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<span className="text-xs font-bold tracking-[0.2em] text-primary-container uppercase mb-2 block">Developer Environment</span>
<h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Run and Test Modes</h1>
</div>
<div className="flex gap-2 p-1 bg-surface-container-lowest rounded-lg border border-outline-variant/10">
<button className="px-4 py-2 text-xs font-bold rounded bg-primary-container text-on-primary-fixed flex items-center gap-2 transition-all">
<span className="material-symbols-outlined text-sm" style={{fontVariationSettings: `'FILL' 1`}}>play_arrow</span>
                    Deploy Live
                </button>
</div>
</header>
{/*  Split-Pane Dashboard  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
{/*  Left Pane: Control Center  */}
<div className="lg:col-span-5 flex flex-col gap-6">
{/*  Interactive Mode Toggles  */}
<div className="glass-panel p-6 rounded-xl flex flex-col gap-6 shadow-2xl">
<div className="flex flex-col gap-1">
<h2 className="text-xl font-headline font-bold text-on-surface">Execution Context</h2>
<p className="text-sm text-on-surface-variant">Switch between simulation and production environments.</p>
</div>
<div className="grid grid-cols-3 gap-3">
<button className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg bg-primary-container/10 border border-primary-container/30 text-primary-container transition-all hover:bg-primary-container/20 group">
<span className="material-symbols-outlined text-3xl transition-transform group-hover:scale-110" style={{fontVariationSettings: `'FILL' 1`}}>bolt</span>
<span className="text-xs font-bold tracking-widest uppercase">Run</span>
</button>
<button className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg bg-surface-container-highest/40 border border-outline-variant/20 text-on-surface-variant transition-all hover:border-primary-container/40 hover:text-on-surface group">
<span className="material-symbols-outlined text-3xl transition-transform group-hover:scale-110">biotech</span>
<span className="text-xs font-bold tracking-widest uppercase">Test</span>
</button>
<button className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg bg-surface-container-highest/40 border border-outline-variant/20 text-on-surface-variant transition-all hover:border-primary-container/40 hover:text-on-surface group">
<span className="material-symbols-outlined text-3xl transition-transform group-hover:scale-110">visibility</span>
<span className="text-xs font-bold tracking-widest uppercase">Preview</span>
</button>
</div>
</div>
{/*  Simulation Metrics (Bento Style)  */}
<div className="grid grid-cols-2 gap-4">
<div className="glass-panel p-5 rounded-xl border border-outline-variant/10">
<p className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase mb-4">Latency</p>
<div className="flex items-end gap-2">
<span className="text-3xl font-headline font-bold text-primary-container">24</span>
<span className="text-sm text-on-surface-variant pb-1">ms</span>
</div>
<div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary-container w-1/4"></div>
</div>
</div>
<div className="glass-panel p-5 rounded-xl border border-outline-variant/10">
<p className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase mb-4">Integrity</p>
<div className="flex items-end gap-2">
<span className="text-3xl font-headline font-bold text-secondary-container">99.8</span>
<span className="text-sm text-on-surface-variant pb-1">%</span>
</div>
<div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-secondary-container w-4/5"></div>
</div>
</div>
</div>
{/*  Logs / Console Output  */}
<div className="flex-grow glass-panel rounded-xl overflow-hidden flex flex-col border border-outline-variant/5">
<div className="bg-surface-container-lowest px-4 py-2 border-b border-outline-variant/10 flex items-center justify-between">
<span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Active Console</span>
<div className="flex gap-1">
<div className="w-2 h-2 rounded-full bg-error/40"></div>
<div className="w-2 h-2 rounded-full bg-primary-container/40"></div>
</div>
</div>
<div className="p-4 font-mono text-xs text-on-surface-variant space-y-2 overflow-y-auto">
<p><span className="text-primary-container">[08:42:11]</span> Initializing Obsidian Core Engine...</p>
<p><span className="text-primary-container">[08:42:12]</span> Hydrating virtual DOM tree...</p>
<p><span className="text-secondary-container">[08:42:14]</span> Warning: Dynamic route hydration delayed.</p>
<p><span className="text-primary-container">[08:42:15]</span> Handshake established with node_042.</p>
<p><span className="text-on-surface">root@obsidian:~$</span> <span className="animate-pulse">_</span></p>
</div>
</div>
</div>
{/*  Right Pane: Device Preview / Terminal  */}
<div className="lg:col-span-7 flex items-center justify-center relative">
{/*  Background Glow  */}
<div className="absolute inset-0 bg-gradient-to-tr from-primary-container/10 via-transparent to-secondary-container/10 blur-[100px] pointer-events-none"></div>
{/*  Integrated Mobile Mockup  */}
<div className="relative z-10 w-full max-w-[340px] aspect-[9/18.5] bg-[#000] rounded-[3rem] p-3 shadow-[0_0_100px_rgba(0,0,0,0.8)] border-[8px] border-surface-container-highest overflow-hidden">
{/*  Notch  */}
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#000] rounded-b-2xl z-20"></div>
{/*  App Content Simulation  */}
<div className="w-full h-full bg-surface-dim rounded-[2rem] overflow-hidden flex flex-col relative">
<div className="p-6 pt-12">
<div className="flex items-center justify-between mb-8">
<span className="material-symbols-outlined text-primary-container">menu</span>
<div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/20"></div>
</div>
<h3 className="font-headline text-2xl font-bold mb-2">User Journey</h3>
<p className="text-xs text-on-surface-variant mb-6">Simulation running on Edge Node v2.1</p>
<div className="space-y-4">
<div className="p-4 rounded-xl bg-surface-container-high/40 border border-outline-variant/10">
<div className="flex items-center gap-3 mb-3">
<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-container to-secondary-container"></div>
<div>
<p className="text-xs font-bold">Project Alpha</p>
<p className="text-[10px] opacity-60">Status: Active</p>
</div>
</div>
<div className="h-1 w-full bg-surface-container-highest rounded-full">
<div className="h-full bg-primary-container w-2/3 rounded-full"></div>
</div>
</div>
<div className="grid grid-cols-2 gap-3">
<div className="aspect-square rounded-xl bg-surface-container-highest/40 flex flex-col items-center justify-center p-3 border border-outline-variant/10">
<span className="material-symbols-outlined text-secondary-container mb-2">analytics</span>
<span className="text-[10px] font-bold">Metrics</span>
</div>
<div className="aspect-square rounded-xl bg-surface-container-highest/40 flex flex-col items-center justify-center p-3 border border-outline-variant/10">
<span className="material-symbols-outlined text-primary-container mb-2">hub</span>
<span className="text-[10px] font-bold">Nodes</span>
</div>
</div>
</div>
</div>
{/*  Mock Floating Action  */}
<div className="absolute bottom-8 right-6 w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shadow-lg shadow-primary-container/20">
<span className="material-symbols-outlined text-on-primary-fixed">add</span>
</div>
</div>
</div>
{/*  Technical Callout Labels  */}
<div className="absolute -right-4 top-1/4 glass-panel p-4 rounded-lg hidden xl:block">
<p className="text-[10px] font-bold text-primary-container mb-1">REAL-TIME SYNC</p>
<p className="text-xs text-on-surface-variant">Hot reload active: 0.2s</p>
</div>
<div className="absolute -left-8 bottom-1/4 glass-panel p-4 rounded-lg hidden xl:block">
<p className="text-[10px] font-bold text-secondary-container mb-1">DEBUG OVERLAY</p>
<p className="text-xs text-on-surface-variant">No leaks detected.</p>
</div>
</div>
</div>
</main>

    </div>
  );
}

export function PageHowToCreateStitch() {
  return (
    <div className="stitch-page relative w-full h-[800px] overflow-hidden overflow-y-auto rounded-xl border border-outline-variant/30 shadow-2xl bg-[#0e0e0e]" style={{ isolation: 'isolate' }}>
      
{/*  TopNavBar  */}
<nav className="absolute top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-xl flex justify-between items-center px-8 py-4 w-full shadow-[0_0_40px_rgba(0,240,255,0.06)]">
<div className="text-2xl font-black tracking-tighter text-[#00F0FF] font-['Epilogue']">
            Obsidian Gallery
        </div>
<div className="hidden md:flex items-center space-x-8">
<a className="text-[#00F0FF] border-b-2 border-[#00F0FF] pb-1 font-['Epilogue'] font-bold tracking-tight" href="#">Showcase</a>
<a className="text-gray-400 font-medium font-['Epilogue'] hover:text-[#00F0FF] transition-colors duration-300" href="#">Resources</a>
<a className="text-gray-400 font-medium font-['Epilogue'] hover:text-[#00F0FF] transition-colors duration-300" href="#">Docs</a>
</div>
<div className="flex items-center space-x-4">
<span className="material-symbols-outlined text-[#00F0FF] cursor-pointer active:scale-95 duration-200">notifications</span>
<span className="material-symbols-outlined text-[#00F0FF] cursor-pointer active:scale-95 duration-200">grid_view</span>
<div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center overflow-hidden">
<img alt="User profile avatar" className="w-full h-full object-cover" data-alt="Abstract geometric avatar for user profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl3nRzuxiiQ5cwVdKLVG5v9aiGGCY4qUFoF_6dlNgw0oI3teMZFmJ-hfwtaUu_cL5JT_IR0kQr7E9fuDlIKhaL47XXYyoJcK7zKQyZaYxTOc9pgGyDloWCLJhgYFDZNfkg968t1ajU45sSWMzh0NLShIf27QzJ4nylduktPgrHT61HSpP2v8SfhCtB48IvoabYHd5yEIIGS7kyuPL-TVEsPhTEZPeIYIfzw10NxOU7ui3wgl5HO-BxB_sBmCPQuR29Zs3c5mmxG-M"/>
</div>
</div>
</nav>
{/*  SideNavBar (Guide Navigation)  */}
<aside className="absolute left-0 h-full min-h-[800px] w-64 border-r border-white/5 bg-[#131313] hidden lg:flex flex-col pt-24 pb-8 z-40 bg-gradient-to-r from-[#1c1b1b] to-transparent">
<div className="px-6 mb-10">
<div className="flex items-center space-x-3 mb-1">
<span className="material-symbols-outlined text-[#00F0FF]">auto_awesome</span>
<span className="text-lg font-bold text-[#e5e2e1] font-['Manrope']">Project Creation</span>
</div>
<p className="text-xs text-gray-500 font-['Manrope'] uppercase tracking-widest">Mastery Series</p>
</div>
<nav className="flex-1 space-y-1">
<div className="px-4">
<a className="flex items-center px-4 py-3 rounded-md bg-[#00F0FF]/10 text-[#00F0FF] border-r-4 border-[#00F0FF] font-['Manrope'] font-medium text-sm group transition-all duration-200" href="#step-1">
<span className="material-symbols-outlined mr-3 group-hover:translate-x-1 duration-300">school</span>
                    Introduction
                </a>
<a className="flex items-center px-4 py-3 rounded-md text-gray-500 hover:text-[#e5e2e1] hover:bg-white/5 font-['Manrope'] font-medium text-sm group transition-all duration-200" href="#step-2">
<span className="material-symbols-outlined mr-3 group-hover:translate-x-1 duration-300">settings_input_component</span>
                    Setup Phase
                </a>
<a className="flex items-center px-4 py-3 rounded-md text-gray-500 hover:text-[#e5e2e1] hover:bg-white/5 font-['Manrope'] font-medium text-sm group transition-all duration-200" href="#step-3">
<span className="material-symbols-outlined mr-3 group-hover:translate-x-1 duration-300">brush</span>
                    Design Principles
                </a>
<a className="flex items-center px-4 py-3 rounded-md text-gray-500 hover:text-[#e5e2e1] hover:bg-white/5 font-['Manrope'] font-medium text-sm group transition-all duration-200" href="#step-4">
<span className="material-symbols-outlined mr-3 group-hover:translate-x-1 duration-300">code</span>
                    Implementation
                </a>
<a className="flex items-center px-4 py-3 rounded-md text-gray-500 hover:text-[#e5e2e1] hover:bg-white/5 font-['Manrope'] font-medium text-sm group transition-all duration-200" href="#step-5">
<span className="material-symbols-outlined mr-3 group-hover:translate-x-1 duration-300">verified</span>
                    Final Review
                </a>
</div>
</nav>
<div className="mt-auto px-6 space-y-4">
<button className="w-full py-3 px-4 bg-gradient-to-r from-primary-container to-primary-fixed-dim text-on-primary-fixed font-bold rounded-lg text-sm active:scale-95 transition-transform duration-200">
                Launch Editor
            </button>
<div className="flex flex-col space-y-2 pt-4 border-t border-white/5">
<a className="flex items-center text-xs text-gray-500 hover:text-[#e5e2e1] font-['Manrope']" href="#">
<span className="material-symbols-outlined text-sm mr-2">help</span> Support
                </a>
<a className="flex items-center text-xs text-gray-500 hover:text-[#e5e2e1] font-['Manrope']" href="#">
<span className="material-symbols-outlined text-sm mr-2">settings</span> Settings
                </a>
</div>
</div>
</aside>
{/*  Main Content Canvas  */}
<main className="lg:ml-64 pt-32 pb-24 px-6 md:px-12 relative">
{/*  Ambient Globs  */}
<div className="absolute top-20 right-[-10%] w-96 h-96 bg-primary-container/10 blur-[120px] rounded-full -z-10"></div>
<div className="absolute bottom-40 left-[-5%] w-[500px] h-[500px] bg-secondary-container/5 blur-[150px] rounded-full -z-10"></div>
<header className="max-w-4xl mb-24">
<h1 className="font-headline font-black text-6xl md:text-8xl tracking-tighter mb-6 leading-none">
                Mastering <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-secondary-container to-primary-container">The Workflow.</span>
</h1>
<p className="text-on-surface-variant text-xl md:text-2xl font-body max-w-2xl leading-relaxed">
                Step into the Obsidian framework. A guided journey from raw concept to high-fidelity digital reality.
            </p>
</header>
{/*  Vertical Timeline Section  */}
<div className="relative max-w-6xl mx-auto">
{/*  Central Line  */}
<div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px timeline-gradient md:-translate-x-1/2 opacity-20 hidden md:block"></div>
{/*  Step 1: Conceptualize  */}
<section className="relative mb-40 md:flex items-center justify-between" id="step-1">
<div className="md:w-[45%] mb-12 md:mb-0 order-2 md:order-1">
<div className="bento-grid grid grid-cols-2 gap-4">
<div className="col-span-2 glass-panel p-8 rounded-xl border border-white/5 neon-glow-primary">
<span className="text-primary-container font-headline font-black text-5xl mb-4 block">01</span>
<h3 className="font-headline font-bold text-3xl mb-4">Conceptualize</h3>
<p className="text-on-surface-variant font-body leading-relaxed">Choose your core project objective. Define the North Star that guides every pixel and interaction pattern.</p>
</div>
<div className="glass-panel aspect-square rounded-xl border border-white/5 flex items-center justify-center p-6 overflow-hidden">
<img className="object-cover w-full h-full opacity-60" data-alt="Modern vintage computer hardware macro shot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_LQQ4SHTcOHjaoN9jo4cjK7y_H4QW2IL-sgKvb7fOn5raVQxaIPDgQyVucc916XcAz5A8TK-P7JNJEmchAIa_oCbNuDNY6c7w0DPPHr0YpOwTow4qLCPsR5yvJ6KwZh7QnfNDflgrR5luixEufdTROOQQTOK0x6ZlIQDm8udFccpulbwrHInPpU8l-oY9V0dY9eDP08sZdi5q1V2VHqFCJAFYhHI895m1kYvfHhhjCtMsEM-IXeQYxki-VXnShTAkFSiFcQ_Esmg"/>
</div>
<div className="glass-panel aspect-square rounded-xl border border-white/5 flex items-center justify-center p-6 bg-secondary-container/10">
<span className="material-symbols-outlined text-4xl text-secondary" style={{fontVariationSettings: `'FILL' 1`}}>lightbulb</span>
</div>
</div>
</div>
{/*  Timeline Node  */}
<div className="absolute left-6 md:left-1/2 w-12 h-12 bg-surface border-4 border-primary-container rounded-full md:-translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_20px_#00F0FF] order-2">
<span className="text-primary-container font-black">1</span>
</div>
<div className="md:w-[45%] order-1 md:order-2 hidden md:block">
{/*  Decor/Empty Space  */}
</div>
</section>
{/*  Step 2: Setup Env  */}
<section className="relative mb-40 md:flex items-center justify-between" id="step-2">
<div className="md:w-[45%] hidden md:block">
{/*  Decor  */}
</div>
{/*  Timeline Node  */}
<div className="absolute left-6 md:left-1/2 w-12 h-12 bg-surface border-4 border-secondary-container rounded-full md:-translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_20px_#cf5cff]">
<span className="text-secondary-container font-black">2</span>
</div>
<div className="md:w-[45%] pl-12 md:pl-0">
<div className="glass-panel p-8 rounded-xl border border-white/5 relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/10 blur-3xl -z-10"></div>
<span className="text-secondary-container font-headline font-black text-5xl mb-4 block">02</span>
<h3 className="font-headline font-bold text-3xl mb-4">Setup Env</h3>
<p className="text-on-surface-variant font-body mb-8 leading-relaxed">Initialize the workspace environment. Configure the Tailwind runtime and core Obsidian assets.</p>
<div className="bg-black/40 rounded p-4 font-mono text-xs text-primary/70 border border-white/5">
<div className="flex items-center space-x-2 mb-2">
<div className="w-2 h-2 rounded-full bg-error"></div>
<div className="w-2 h-2 rounded-full bg-secondary"></div>
<div className="w-2 h-2 rounded-full bg-primary-container"></div>
</div>
<span className="text-secondary">$</span> npx create-obsidian-app@latest<br/>
<span className="text-secondary">$</span> cd my-dark-vision<br/>
<span className="text-secondary">$</span> npm run dev
                        </div>
</div>
</div>
</section>
{/*  Step 3: Design Ops  */}
<section className="relative mb-40 md:flex items-center justify-between" id="step-3">
<div className="md:w-[45%] mb-12 md:mb-0 order-2 md:order-1">
<div className="grid grid-cols-3 gap-4">
<div className="col-span-3 glass-panel p-8 rounded-xl border border-white/5">
<span className="text-primary-container font-headline font-black text-5xl mb-4 block">03</span>
<h3 className="font-headline font-bold text-3xl mb-4">Design Ops</h3>
<p className="text-on-surface-variant font-body leading-relaxed">Apply design system tokens. Map hex codes to semantic roles to ensure architectural consistency.</p>
</div>
<div className="h-24 rounded-lg bg-surface-container-high border border-primary-container/20 flex flex-col justify-end p-2">
<span className="text-[10px] text-primary-container font-bold uppercase">Primary</span>
</div>
<div className="h-24 rounded-lg bg-secondary-container border border-secondary/20 flex flex-col justify-end p-2">
<span className="text-[10px] text-on-secondary-container font-bold uppercase">Secondary</span>
</div>
<div className="h-24 rounded-lg bg-surface-container-lowest border border-white/5 flex flex-col justify-end p-2">
<span className="text-[10px] text-gray-500 font-bold uppercase">Surface</span>
</div>
</div>
</div>
{/*  Timeline Node  */}
<div className="absolute left-6 md:left-1/2 w-12 h-12 bg-surface border-4 border-primary-container rounded-full md:-translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_20px_#00F0FF] order-2">
<span className="text-primary-container font-black">3</span>
</div>
<div className="md:w-[45%] order-1 md:order-2 hidden md:block">
{/*  Decor  */}
</div>
</section>
{/*  Step 4: Functional Dev  */}
<section className="relative mb-40 md:flex items-center justify-between" id="step-4">
<div className="md:w-[45%] hidden md:block">
{/*  Decor  */}
</div>
{/*  Timeline Node  */}
<div className="absolute left-6 md:left-1/2 w-12 h-12 bg-surface border-4 border-secondary-container rounded-full md:-translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_20px_#cf5cff]">
<span className="text-secondary-container font-black">4</span>
</div>
<div className="md:w-[45%] pl-12 md:pl-0">
<div className="glass-panel p-8 rounded-xl border border-white/5">
<span className="text-secondary-container font-headline font-black text-5xl mb-4 block">04</span>
<h3 className="font-headline font-bold text-3xl mb-4">Functional Dev</h3>
<p className="text-on-surface-variant font-body mb-8 leading-relaxed">Integrate core logic and components. Build the interactive shell and state-managed interfaces.</p>
<div className="grid grid-cols-2 gap-4">
<div className="bg-surface-container-high/50 p-4 rounded-lg flex items-center space-x-3">
<span className="material-symbols-outlined text-primary-container">layers</span>
<span className="text-sm font-medium">Shell Logic</span>
</div>
<div className="bg-surface-container-high/50 p-4 rounded-lg flex items-center space-x-3">
<span className="material-symbols-outlined text-secondary">database</span>
<span className="text-sm font-medium">Data Bind</span>
</div>
</div>
</div>
</div>
</section>
{/*  Step 5: Review & Launch  */}
<section className="relative mb-20 md:flex items-center justify-between" id="step-5">
<div className="md:w-[45%] mb-12 md:mb-0 order-2 md:order-1">
<div className="glass-panel p-8 rounded-xl border border-white/5 overflow-hidden group">
<span className="text-primary-container font-headline font-black text-5xl mb-4 block">05</span>
<h3 className="font-headline font-bold text-3xl mb-4">Review &amp; Launch</h3>
<p className="text-on-surface-variant font-body mb-8 leading-relaxed">Final QA and public deployment. Verify accessibility, performance, and cross-platform fidelity.</p>
<div className="relative rounded-xl overflow-hidden h-48 border border-white/5">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Cyberpunk blue glowing digital connection network" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAw18-NxoR8sx4m0bl_fA7_mJGzTl5LGqvvyiSoDDETOI2VtPVkc0RRUSAmvBHC0zt3cMt57QsbyjxKKjVvY5Xv3S8TH35j2cw8bxCRlQdKTH3NZZFY7HmWzgt3clV-6zFJaM5-vpeibui6GfByObl4QpF15jVM9_dYY6jC6Vkuh1YR0rsQ2733PXwEYpyY7lfWpXVdrHG9iJIayXUOd_DFRwFYwIpx-_CW_hgJafLk15cyVSYeU_ll5B0zS986SPW1tehrDNuSy4"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
<div className="flex items-center space-x-2">
<span className="w-3 h-3 bg-primary-container rounded-full animate-pulse shadow-[0_0_8px_#00F0FF]"></span>
<span className="text-xs font-bold uppercase tracking-widest text-primary-container">System Live</span>
</div>
</div>
</div>
</div>
</div>
{/*  Timeline Node  */}
<div className="absolute left-6 md:left-1/2 w-16 h-16 bg-surface border-4 border-primary-container rounded-full md:-translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_40px_#00F0FF] order-2">
<span className="material-symbols-outlined text-primary-container text-3xl" style={{fontVariationSettings: `'FILL' 1`}}>rocket_launch</span>
</div>
<div className="md:w-[45%] order-1 md:order-2 hidden md:block">
{/*  Final CTA  */}
<div className="p-10 flex flex-col items-center text-center">
<p className="font-headline font-bold text-2xl mb-6">Ready to Build?</p>
<button className="bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-fixed px-10 py-4 rounded-full font-black text-lg shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95 transition-all">
                            Initialize Project
                        </button>
</div>
</div>
</section>
</div>
</main>
{/*  BottomNavBar (Mobile Only)  */}
<nav className="md:hidden absolute bottom-0 left-0 right-0 glass-panel border-t border-white/5 px-6 py-4 flex justify-around items-center z-50">
<a className="flex flex-col items-center text-[#00F0FF]" href="#step-1">
<span className="material-symbols-outlined">school</span>
<span className="text-[10px] mt-1 font-bold">Intro</span>
</a>
<a className="flex flex-col items-center text-gray-400" href="#step-2">
<span className="material-symbols-outlined">settings_input_component</span>
<span className="text-[10px] mt-1 font-bold">Setup</span>
</a>
<a className="flex flex-col items-center text-gray-400" href="#step-3">
<span className="material-symbols-outlined">brush</span>
<span className="text-[10px] mt-1 font-bold">Design</span>
</a>
<a className="flex flex-col items-center text-gray-400" href="#step-4">
<span className="material-symbols-outlined">code</span>
<span className="text-[10px] mt-1 font-bold">Dev</span>
</a>
<a className="flex flex-col items-center text-gray-400" href="#step-5">
<span className="material-symbols-outlined">verified</span>
<span className="text-[10px] mt-1 font-bold">Review</span>
</a>
</nav>
{/*  Floating Action Button  */}
<button className="absolute bottom-24 right-8 w-14 h-14 bg-primary-container text-on-primary-fixed rounded-full shadow-[0_10px_30px_rgba(0,240,255,0.4)] flex items-center justify-center z-50 hover:scale-110 active:scale-90 transition-all">
<span className="material-symbols-outlined">add</span>
</button>

    </div>
  );
}

export function PageRunAndTestStitch() {
  return (
    <div className="stitch-page relative w-full h-[800px] overflow-hidden overflow-y-auto rounded-xl border border-outline-variant/30 shadow-2xl bg-[#0e0e0e]" style={{ isolation: 'isolate' }}>
      
{/*  TopAppBar  */}
<header className="bg-[#131313]/80 backdrop-blur-xl border-b border-[#3b494b]/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] docked full-width top-0 z-50 absolute">
<div className="flex justify-between items-center w-full px-6 h-16">
<div className="flex items-center gap-8">
<span className="text-xl font-black tracking-tighter text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] font-headline uppercase">STATE_ENGINE</span>
<nav className="hidden md:flex items-center gap-6">
<a className="text-[#00F0FF] border-b-2 border-[#00F0FF] pb-1 font-headline tracking-tighter uppercase font-bold text-sm" href="#">Systems</a>
<a className="text-[#e5e2e1]/60 hover:text-[#e5e2e1] font-headline tracking-tighter uppercase font-bold text-sm transition-all duration-300" href="#">Logs</a>
<a className="text-[#e5e2e1]/60 hover:text-[#e5e2e1] font-headline tracking-tighter uppercase font-bold text-sm transition-all duration-300" href="#">Nodes</a>
</nav>
</div>
<div className="flex items-center gap-4">
<button className="p-2 hover:bg-[#00F0FF]/10 transition-all duration-300 rounded-lg text-[#e5e2e1]/60 hover:text-[#00F0FF]">
<span className="material-symbols-outlined" data-icon="notifications_active">notifications_active</span>
</button>
<button className="p-2 hover:bg-[#00F0FF]/10 transition-all duration-300 rounded-lg text-[#e5e2e1]/60 hover:text-[#00F0FF]">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
</button>
<div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30">
<img alt="User Architectural Profile" className="w-full h-full object-cover" data-alt="Close up of a professional user architectural profile portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeKBsZ2Wgm9gqLFHSBdKsifZCb4nd3TtGPp4eDxH1WFlPBQTvqXT3A9fXfx1JSZZxV1HmOVBIdV2bCNpymMn2MlrHPLRENmTQgdV04isxYxeGNnW2-oxx6Hzpx34qMiw5_xsb9E8F45ph--Og6mxrqY7JTziCOn0tDoe3mxo94Wx1BNIgwyFJYmMBPChdDUzbYxLfrcGJSSb4apwUDR8PthbJbHXw3GoHzDOnKDMya1d1e7cnPcAT3bMtNaT-5C-h94cxOeSgcpHU"/>
</div>
</div>
</div>
</header>
{/*  SideNavBar  */}
<aside className="bg-[#0e0e0e]/90 backdrop-blur-2xl border-r border-[#3b494b]/15 h-full min-h-[800px] w-64 absolute left-0 top-0 pt-20 z-40 hidden lg:flex flex-col py-8 gap-4 font-body">
<div className="px-6 mb-6">
<h2 className="text-lg font-bold text-[#00F0FF] font-headline">Logic_Schematic</h2>
<p className="text-[10px] text-[#e5e2e1]/40 uppercase tracking-widest mt-1">v4.2.0-stable</p>
</div>
<nav className="flex-1 space-y-1">
<a className="flex items-center gap-3 px-6 py-3 bg-[#00F0FF]/5 text-[#00F0FF] border-r-4 border-[#00F0FF] shadow-[inset_-10px_0_15px_-10px_rgba(0,240,255,0.3)] transition-colors duration-200" href="#">
<span className="material-symbols-outlined text-xl" data-icon="hub">hub</span>
<span className="text-sm font-medium tracking-wide">App Level</span>
</a>
<a className="flex items-center gap-3 px-6 py-3 text-[#e5e2e1]/40 hover:text-[#e5e2e1]/80 hover:bg-[#353534]/40 transition-colors duration-200" href="#">
<span className="material-symbols-outlined text-xl" data-icon="layers">layers</span>
<span className="text-sm font-medium tracking-wide">Page Level</span>
</a>
<a className="flex items-center gap-3 px-6 py-3 text-[#e5e2e1]/40 hover:text-[#e5e2e1]/80 hover:bg-[#353534]/40 transition-colors duration-200" href="#">
<span className="material-symbols-outlined text-xl" data-icon="widgets">widgets</span>
<span className="text-sm font-medium tracking-wide">Component Level</span>
</a>
</nav>
<div className="px-6 mt-auto space-y-4">
<button className="w-full py-2.5 bg-primary-fixed-dim text-on-primary-fixed font-bold text-xs uppercase tracking-widest rounded hover:shadow-[0_0_15px_rgba(0,219,233,0.4)] transition-all">
                Deploy Schema
            </button>
<div className="pt-4 border-t border-outline-variant/10 space-y-2">
<a className="flex items-center gap-3 text-xs text-[#e5e2e1]/40 hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined text-sm" data-icon="description">description</span>
                    Docs
                </a>
<a className="flex items-center gap-3 text-xs text-[#e5e2e1]/40 hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined text-sm" data-icon="help_center">help_center</span>
                    Support
                </a>
</div>
</div>
</aside>
{/*  Main Content  */}
<main className="lg:pl-64 pt-16 min-h-full min-h-[800px] relative overflow-hidden">
{/*  Ambient Background Effects  */}
<div className="absolute inset-0 grid-bg pointer-events-none"></div>
<div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
<div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none"></div>
<div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
{/*  Hero Section  */}
<section className="mb-20">
<header className="mb-12">
<div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 mb-4">
<span className="w-2 h-2 rounded-full bg-primary-fixed-dim animate-pulse"></span>
<span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em]">System.Core.Engine</span>
</div>
<h1 className="text-6xl lg:text-7xl font-black font-headline text-on-background tracking-tighter uppercase leading-none mb-4">
                        State Engine<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-tertiary-container">Architecture</span>
</h1>
<p className="max-w-2xl text-on-surface-variant font-body leading-relaxed text-lg">
                        A centralized reactive fabric governing data persistence across atomic component interactions and global system logic.
                    </p>
</header>
{/*  Architecture Diagram  */}
<div className="relative w-full aspect-[21/9] bg-surface-container-lowest rounded-lg border border-outline-variant/10 flex items-center justify-center group">
<div className="absolute inset-0 grid-bg opacity-30"></div>
{/*  SVG Logic Lines  */}
<svg className="absolute inset-0 w-full h-full pointer-events-none">
<line stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" x1="50%" x2="30%" y1="50%" y2="35%"></line>
<line stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" x1="50%" x2="70%" y1="50%" y2="35%"></line>
<line stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" x1="50%" x2="50%" y1="50%" y2="70%"></line>
{/*  Data Pulse Dots  */}
<circle fill="#00dbe9" r="3">
<animatemotion dur="4s" path="M 384 121.5 L 640 180" repeatCount="indefinite"></animatemotion>
</circle>
</svg>
{/*  Core Node (App State)  */}
<div className="relative z-20 group/node">
<div className="w-32 h-32 rounded-full bg-surface-container-high border-2 border-primary-container glow-node flex items-center justify-center cursor-crosshair transition-transform duration-500 hover:scale-110">
<span className="material-symbols-outlined text-4xl text-primary-container" data-icon="hub">hub</span>
</div>
<div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
<span className="font-headline font-bold text-sm tracking-tighter uppercase text-primary">App_State.Core</span>
</div>
{/*  Tooltip Snippet  */}
<div className="absolute -bottom-16 left-1/2 -translate-x-1/2 glass-card p-3 rounded opacity-0 group-hover/node:opacity-100 transition-opacity duration-300 w-48 shadow-2xl">
<pre className="text-[9px] text-tertiary font-mono leading-tight">{`{
  "auth": true,
  "theme": "obsidian",
  "sync": "12ms"
}`}</pre>
</div>
</div>
{/*  Branching Node: Page Level  */}
<div className="absolute top-[20%] left-[25%] group/node">
<div className="w-20 h-20 rounded-lg bg-surface-container-high border border-secondary/40 flex items-center justify-center cursor-crosshair hover:border-secondary transition-all">
<span className="material-symbols-outlined text-2xl text-secondary" data-icon="layers">layers</span>
</div>
<div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
<span className="font-headline font-bold text-xs tracking-tighter uppercase text-secondary">Page_Context</span>
</div>
<div className="absolute -bottom-12 left-1/2 -translate-x-1/2 glass-card p-2 rounded opacity-0 group-hover/node:opacity-100 transition-opacity duration-300 w-32">
<pre className="text-[8px] text-secondary font-mono">path: "/dashboard"
active: true</pre>
</div>
</div>
{/*  Branching Node: Component Level  */}
<div className="absolute bottom-[15%] right-[30%] group/node">
<div className="w-16 h-16 rounded bg-surface-container-high border border-tertiary/30 flex items-center justify-center cursor-crosshair hover:border-tertiary transition-all">
<span className="material-symbols-outlined text-xl text-tertiary" data-icon="widgets">widgets</span>
</div>
<div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
<span className="font-headline font-bold text-[10px] tracking-tighter uppercase text-tertiary">Component_Atomic</span>
</div>
</div>
{/*  Decorative Floating Meta  */}
<div className="absolute top-10 right-10 flex flex-col items-end opacity-40">
<span className="text-[10px] font-mono text-outline uppercase tracking-widest">Protocol: JSON_HYDRATE</span>
<div className="w-32 h-1 bg-outline-variant/20 mt-1 rounded-full overflow-hidden">
<div className="w-2/3 h-full bg-primary-container"></div>
</div>
</div>
</div>
</section>
{/*  Explanation Cards - Bento Style  */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{/*  App Level  */}
<div className="glass-card p-8 group hover:bg-surface-container-high/60 transition-all duration-500 border-l-4 border-l-primary-container">
<div className="flex justify-between items-start mb-6">
<span className="material-symbols-outlined text-primary-container text-4xl" data-icon="database">database</span>
<span className="text-[10px] font-mono text-primary-container/60">01</span>
</div>
<h3 className="text-2xl font-black font-headline tracking-tighter uppercase text-on-background mb-4">Global Hub</h3>
<p className="text-on-surface-variant font-body text-sm leading-relaxed mb-6">
                        The ultimate source of truth. Manages authentication, user preferences, and cross-module synchronization protocols.
                    </p>
<div className="pt-4 border-t border-outline-variant/10">
<code className="text-[10px] text-primary-fixed-dim/80 font-mono">&gt;&gt; system.hydrate_global()</code>
</div>
</div>
{/*  Page Level  */}
<div className="glass-card p-8 group hover:bg-surface-container-high/60 transition-all duration-500 border-l-4 border-l-secondary">
<div className="flex justify-between items-start mb-6">
<span className="material-symbols-outlined text-secondary text-4xl" data-icon="account_tree">account_tree</span>
<span className="text-[10px] font-mono text-secondary/60">02</span>
</div>
<h3 className="text-2xl font-black font-headline tracking-tighter uppercase text-on-background mb-4">Route Context</h3>
<p className="text-on-surface-variant font-body text-sm leading-relaxed mb-6">
                        Scoped data structures isolated to specific navigation paths. Ensures ephemeral state doesn't pollute the global store.
                    </p>
<div className="pt-4 border-t border-outline-variant/10">
<code className="text-[10px] text-secondary-fixed-dim/80 font-mono">&gt;&gt; page.map_context(route)</code>
</div>
</div>
{/*  Component Level  */}
<div className="glass-card p-8 group hover:bg-surface-container-high/60 transition-all duration-500 border-l-4 border-l-tertiary">
<div className="flex justify-between items-start mb-6">
<span className="material-symbols-outlined text-tertiary text-4xl" data-icon="settings_input_component">settings_input_component</span>
<span className="text-[10px] font-mono text-tertiary/60">03</span>
</div>
<h3 className="text-2xl font-black font-headline tracking-tighter uppercase text-on-background mb-4">Atomic Pulse</h3>
<p className="text-on-surface-variant font-body text-sm leading-relaxed mb-6">
                        Low-latency internal component logic. Highly responsive, focused purely on UI behavior and local interaction cycles.
                    </p>
<div className="pt-4 border-t border-outline-variant/10">
<code className="text-[10px] text-tertiary-fixed-dim/80 font-mono">&gt;&gt; node.emit_local_pulse()</code>
</div>
</div>
</div>
{/*  System Logs Section (Subtle code aesthetic)  */}
<section className="mt-20">
<div className="flex items-center justify-between mb-8">
<h4 className="text-lg font-black font-headline tracking-tight uppercase">Live_State_Feed</h4>
<div className="h-[1px] flex-1 mx-6 bg-outline-variant/20"></div>
<span className="text-xs font-mono text-primary animate-pulse uppercase tracking-widest">Running</span>
</div>
<div className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 p-6 font-mono text-xs overflow-x-auto">
<div className="flex gap-4 mb-2">
<span className="text-[#3b494b]">[14:22:01]</span>
<span className="text-tertiary">INFO:</span>
<span className="text-on-surface-variant">Auth_Provider successfully resolved. Identity token: 0x8F2..</span>
</div>
<div className="flex gap-4 mb-2">
<span className="text-[#3b494b]">[14:22:04]</span>
<span className="text-secondary">PAGING:</span>
<span className="text-on-surface-variant">Navigated to /architecture. Injecting local schematic...</span>
</div>
<div className="flex gap-4 mb-2">
<span className="text-[#3b494b]">[14:22:08]</span>
<span className="text-primary-container">ACTION:</span>
<span className="text-on-surface-variant">Node "App_State.Core" re-rendered (Diff: 0.002ms)</span>
</div>
<div className="flex gap-4">
<span className="text-[#3b494b]">[14:22:12]</span>
<span className="text-error">WARN:</span>
<span className="text-on-surface-variant">Stale component reference detected in Footer_Module. Pruning...</span>
</div>
</div>
</section>
</div>
{/*  Footer  */}
<footer className="mt-20 py-12 px-8 border-t border-outline-variant/10 bg-surface-container-lowest/50 backdrop-blur-md">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
<div className="flex flex-col items-center md:items-start">
<span className="text-xl font-black font-headline tracking-tighter uppercase text-primary">STATE_ENGINE</span>
<span className="text-[10px] text-on-surface-variant mt-1 tracking-[0.3em] uppercase opacity-60">Architectural Logic Unit © 2024</span>
</div>
<div className="flex gap-8">
<a className="text-xs font-bold font-headline uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Documentation</a>
<a className="text-xs font-bold font-headline uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Security</a>
<a className="text-xs font-bold font-headline uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">System Status</a>
</div>
<div className="flex gap-4">
<button className="w-8 h-8 rounded border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all">
<span className="material-symbols-outlined text-sm" data-icon="terminal">terminal</span>
</button>
<button className="w-8 h-8 rounded border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all">
<span className="material-symbols-outlined text-sm" data-icon="code">code</span>
</button>
</div>
</div>
</footer>
</main>

    </div>
  );
}

export function PageGeneralSettingsStitch() {
  return (
    <div className="stitch-page relative w-full h-[800px] overflow-hidden overflow-y-auto rounded-xl border border-outline-variant/30 shadow-2xl bg-[#0e0e0e]" style={{ isolation: 'isolate' }}>
      
{/*  TopAppBar  */}
<header className="bg-zinc-950/70 backdrop-blur-xl absolute top-0 w-full z-50 shadow-[0_8px_32px_rgba(0,0,0,0.5)] h-16">
<div className="flex items-center justify-between px-8 h-full w-full">
<div className="flex items-center gap-8">
<span className="font-['Epilogue'] font-bold tracking-tighter text-xl font-black tracking-tighter text-zinc-100 uppercase">PROJECT_ENGINE</span>
<nav className="hidden md:flex gap-6 items-center">
<a className="text-cyan-400 font-bold font-['Epilogue'] tracking-tight transition-colors" href="#">Setup</a>
<a className="text-zinc-500 hover:text-zinc-100 transition-colors font-['Epilogue'] tracking-tight" href="#">Analytics</a>
<a className="text-zinc-500 hover:text-zinc-100 transition-colors font-['Epilogue'] tracking-tight" href="#">Logs</a>
</nav>
</div>
<div className="flex items-center gap-4">
<button className="text-zinc-500 hover:text-zinc-100 transition-colors scale-95 duration-200">
<span className="material-symbols-outlined">settings</span>
</button>
<button className="text-zinc-500 hover:text-zinc-100 transition-colors scale-95 duration-200">
<span className="material-symbols-outlined">help_outline</span>
</button>
<div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden ml-2 border border-outline-variant/20">
<img alt="User Profile" data-alt="Abstract minimalist user profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOUK0rNWavsKXLCfJaQKDAiw9iOE-EbxhdH3MfEmQ4Nvrt_8LMqeSjHbyyXHosyXxBL03pmQQli_00StXntGLvoa7XuQT1uy1nkd2FzjU5rM7eD8CcKJoF6C-NONI0inHxxOfeH6O-1WIBb8iGshylsN1mnxvRPdYPYIXBo0kyddAOCnjPnTNvRInH03hsOGPdRd82KteUNGCAIhPqepqaIvH-iPehDYL3YUJ5q-XcRKPQHT5kI7SSSesKD5qNVbLlKNHUzag9f3U"/>
</div>
</div>
</div>
</header>
{/*  SideNavBar  */}
<aside className="bg-zinc-900 absolute left-0 top-16 h-[calc(100vh-64px)] z-40 w-20 flex flex-col items-center py-8 transition-all duration-300">
<div className="flex flex-col items-center gap-10 flex-1">
<div className="flex flex-col items-center gap-1">
<div className="text-cyan-400 bg-zinc-800 rounded-none border-r-2 border-cyan-400 p-3 flex items-center justify-center">
<span className="material-symbols-outlined">cloud_done</span>
</div>
<span className="font-['Manrope'] text-[10px] font-medium uppercase tracking-widest text-cyan-400 mt-1">Firebase</span>
</div>
<div className="flex flex-col items-center gap-1">
<div className="text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300 p-3 flex items-center justify-center transition-all">
<span className="material-symbols-outlined">palette</span>
</div>
<span className="font-['Manrope'] text-[10px] font-medium uppercase tracking-widest text-zinc-600 mt-1">Theme</span>
</div>
<div className="flex flex-col items-center gap-1">
<div className="text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300 p-3 flex items-center justify-center transition-all">
<span className="material-symbols-outlined">group_add</span>
</div>
<span className="font-['Manrope'] text-[10px] font-medium uppercase tracking-widest text-zinc-600 mt-1">Team</span>
</div>
<div className="flex flex-col items-center gap-1">
<div className="text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300 p-3 flex items-center justify-center transition-all">
<span className="material-symbols-outlined">extension</span>
</div>
<span className="font-['Manrope'] text-[10px] font-medium uppercase tracking-widest text-zinc-600 mt-1">Modules</span>
</div>
</div>
<div className="mt-auto">
<button className="text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300 p-3 flex items-center justify-center transition-all">
<span className="material-symbols-outlined">logout</span>
</button>
</div>
</aside>
<main className="ml-20 pt-16">
{/*  Hero Section  */}
<section className="relative min-h-[614px] flex flex-col justify-center px-12 md:px-24 py-24 bg-surface-container-lowest overflow-hidden">
<div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
<div className="absolute inset-0 bg-noir-gradient blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
</div>
<p className="font-label text-secondary tracking-[0.3em] uppercase mb-4 text-sm font-semibold">Infrastructure Core</p>
<h1 className="font-headline text-7xl md:text-9xl font-black text-on-surface tracking-tighter leading-none mb-8">Project<br/>Setup.</h1>
<p className="font-body text-on-surface-variant max-w-xl text-lg leading-relaxed">
                Initialize your production environment. Configure deep cloud integration, visual identity systems, and collaborative permissions in a single immersive pipeline.
            </p>
</section>
{/*  Section 1: Firebase Configuration  */}
<section className="relative py-32 px-12 md:px-24 bg-primary-container/10">
<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
<div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-start">
<div className="lg:w-1/3">
<span className="font-label text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Section 01</span>
<h2 className="font-headline text-5xl font-extrabold text-on-surface tracking-tight mb-6">Firebase<br/>Configuration</h2>
<p className="font-body text-on-surface-variant text-sm leading-loose">
                        Connect your application to the global data grid. Specify your project identity and authentication protocols to begin synchronization.
                    </p>
</div>
<div className="lg:w-2/3 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="space-y-2">
<label className="font-label text-xs uppercase tracking-widest text-outline">Project ID</label>
<input className="w-full bg-surface-container-highest border-none rounded py-4 px-6 focus:ring-2 focus:ring-secondary transition-all text-on-surface font-mono text-sm" type="text" value="project-engine-v4"/>
</div>
<div className="space-y-2">
<label className="font-label text-xs uppercase tracking-widest text-outline">API Key</label>
<input className="w-full bg-surface-container-highest border-none rounded py-4 px-6 focus:ring-2 focus:ring-secondary transition-all text-on-surface font-mono text-sm" type="password" value="••••••••••••••••"/>
</div>
<div className="col-span-1 md:col-span-2 space-y-2">
<label className="font-label text-xs uppercase tracking-widest text-outline">Database URL</label>
<input className="w-full bg-surface-container-highest border-none rounded py-4 px-6 focus:ring-2 focus:ring-secondary transition-all text-on-surface font-mono text-sm" type="text" value="https://project-engine-v4.firebaseio.com"/>
</div>
<div className="col-span-1 md:col-span-2 flex items-center justify-between p-6 bg-surface-container-high rounded-xl">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-primary" style={{fontVariationSettings: `'FILL' 1`}}>security</span>
<div>
<h4 className="font-bold text-on-surface">Enable Cloud Firestore</h4>
<p className="text-xs text-on-surface-variant">Real-time database sync across all clients</p>
</div>
</div>
<div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
<div className="absolute right-1 top-1 w-4 h-4 bg-on-primary rounded-full"></div>
</div>
</div>
</div>
</div>
</section>
{/*  Section 2: Theme Definition  */}
<section className="relative py-32 px-12 md:px-24 bg-surface-container-lowest">
<div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse gap-20 items-start">
<div className="lg:w-1/3">
<span className="font-label text-secondary font-bold uppercase tracking-widest text-xs mb-4 block">Section 02</span>
<h2 className="font-headline text-5xl font-extrabold text-on-surface tracking-tight mb-6">Theme<br/>Definition</h2>
<p className="font-body text-on-surface-variant text-sm leading-loose">
                        Sculpt the visual soul of your interface. Define the tonal hierarchy and typographic scale for the Synthetic Noir aesthetic.
                    </p>
</div>
<div className="lg:w-2/3 w-full bg-surface-container p-12 rounded-2xl shadow-2xl">
<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
<div className="space-y-8">
<h4 className="font-label text-xs uppercase tracking-[0.2em] text-outline font-bold">Accent Palette</h4>
<div className="flex gap-4">
<div className="group relative">
<div className="w-16 h-16 rounded-full bg-primary-container ring-4 ring-primary/20 cursor-pointer transition-transform hover:scale-110"></div>
<span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-primary font-bold">VIOLET</span>
</div>
<div className="group relative">
<div className="w-16 h-16 rounded-full bg-secondary-container cursor-pointer transition-transform hover:scale-110"></div>
<span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-outline-variant font-bold">CYAN</span>
</div>
<div className="group relative">
<div className="w-16 h-16 rounded-full bg-tertiary cursor-pointer transition-transform hover:scale-110"></div>
<span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-outline-variant font-bold">AMBER</span>
</div>
<div className="group relative">
<div className="w-16 h-16 rounded-full border border-outline-variant cursor-pointer transition-transform hover:scale-110 flex items-center justify-center">
<span className="material-symbols-outlined text-outline">add</span>
</div>
</div>
</div>
</div>
<div className="space-y-8">
<h4 className="font-label text-xs uppercase tracking-[0.2em] text-outline font-bold">Typography Set</h4>
<div className="space-y-4">
<div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-lg border border-secondary/20">
<span className="font-headline text-lg">Epilogue</span>
<span className="material-symbols-outlined text-secondary">check_circle</span>
</div>
<div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg opacity-50">
<span className="font-['Inter'] text-lg">Inter Display</span>
<span className="material-symbols-outlined text-outline">circle</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  Section 3: Team Invites  */}
<section className="relative py-32 px-12 md:px-24 bg-surface-container-low overflow-hidden">
<div className="absolute -bottom-48 -right-48 w-96 h-96 bg-primary opacity-10 blur-[150px] rounded-full"></div>
<div className="max-w-7xl mx-auto">
<div className="mb-16">
<span className="font-label text-secondary font-bold uppercase tracking-widest text-xs mb-4 block">Section 03</span>
<h2 className="font-headline text-6xl font-extrabold text-on-surface tracking-tight">Team Invites</h2>
</div>
<div className="flex flex-col gap-4">
{/*  Team Member Row  */}
<div className="flex items-center justify-between p-6 bg-surface rounded-xl hover:bg-surface-container-highest transition-all group">
<div className="flex items-center gap-6">
<div className="relative">
<img alt="Team Member" className="w-12 h-12 rounded-full ring-2 ring-primary" data-alt="Cyberpunk style user avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiK41lVwdA7sEYS_ucj1Hj1zeACpOgA_J11myVxu5pH-JgLEsVWDqFyQVfGSo1EqKbFA2twThgEGfMZFsifSpHAAOYT2-tv1DRokh8xQwFJHkTNXGGwm9BifPykrYpObOdc4Iw9gz8ZLi2D7uul79Doaa5yibYP94BS1_xZVk0-ZLDOatiz47TU3scx4tbqFFvUN_9jiUTovAsxkmawatOlailKAHLqv0mdziew00_8JOP7uF2JUp5Qqaz2SVhbOHDtIdd966IMEk"/>
<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-surface rounded-full"></div>
</div>
<div>
<h5 className="font-bold text-on-surface text-lg">Alex Chen</h5>
<p className="text-xs text-on-surface-variant font-label uppercase tracking-wider">System Architect</p>
</div>
</div>
<div className="flex items-center gap-8">
<span className="hidden md:block text-xs font-mono text-outline">alex.chen@engine.io</span>
<div className="flex gap-2">
<button className="p-2 text-outline hover:text-on-surface transition-colors">
<span className="material-symbols-outlined">edit</span>
</button>
<button className="p-2 text-error/60 hover:text-error transition-colors">
<span className="material-symbols-outlined">delete</span>
</button>
</div>
</div>
</div>
{/*  Team Member Row  */}
<div className="flex items-center justify-between p-6 bg-surface rounded-xl hover:bg-surface-container-highest transition-all group">
<div className="flex items-center gap-6">
<div className="relative">
<img alt="Team Member" className="w-12 h-12 rounded-full ring-2 ring-secondary" data-alt="Minimalist female portrait avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb2esF0m4ouAR29hH0VnRbsG7qK66tYPdK_lQ8OxgKb_pYbYOaPcP4d36GYGXSFHBEwmciNPvC45XARo8f5a4_i311k-uOtnqyanBWm-GE7nvTQU-duTwN54Q-9hbrkbxK_yjup_JDA5TlrtNRVdZxNGriC03urjKJx7AUtIHvTNMGAwYIC1qHerTV_sS1zVKeGuBITqK2FRAHviiKPPrXuUI0VqIKZjjnfnam8dZTFLi0tfHqS3FGwuOyXaqq2MpiqT0c8ZhtndY"/>
<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-zinc-500 border-2 border-surface rounded-full"></div>
</div>
<div>
<h5 className="font-bold text-on-surface text-lg">Sarah Vance</h5>
<p className="text-xs text-on-surface-variant font-label uppercase tracking-wider">UI Specialist</p>
</div>
</div>
<div className="flex items-center gap-8">
<span className="hidden md:block text-xs font-mono text-outline">s.vance@engine.io</span>
<div className="flex gap-2">
<button className="p-2 text-outline hover:text-on-surface transition-colors">
<span className="material-symbols-outlined">edit</span>
</button>
<button className="p-2 text-error/60 hover:text-error transition-colors">
<span className="material-symbols-outlined">delete</span>
</button>
</div>
</div>
</div>
{/*  Add Team Action  */}
<div className="mt-8 flex flex-col md:flex-row gap-4">
<input className="flex-1 bg-surface-container-highest border-none rounded-lg py-5 px-8 focus:ring-2 focus:ring-primary transition-all text-on-surface" placeholder="Invite by email address..." type="email"/>
<button className="bg-noir-gradient text-on-primary font-headline font-bold px-12 py-5 rounded-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2">
<span className="material-symbols-outlined">send</span>
                            INVITE MEMBER
                        </button>
</div>
</div>
</div>
</section>
{/*  Footer / Action Bar  */}
<footer className="py-24 px-12 md:px-24 bg-surface-container-lowest flex flex-col items-center justify-center border-t border-outline-variant/10">
<h3 className="font-headline text-3xl font-bold text-on-surface mb-8 tracking-tight">Configuration Complete?</h3>
<div className="flex gap-6">
<button className="px-10 py-4 font-label text-xs font-bold tracking-[0.2em] border border-outline-variant hover:bg-surface-container-high transition-all">SAVE DRAFT</button>
<button className="px-10 py-4 font-label text-xs font-bold tracking-[0.2em] bg-on-surface text-surface hover:opacity-90 transition-all">DEPLOY SYSTEM</button>
</div>
<p className="mt-12 text-[10px] text-outline font-label tracking-[0.3em] uppercase opacity-50">Project Engine V4.0.2 Deployment Ready</p>
</footer>
</main>

    </div>
  );
}

export function PageProjectSetupStitch() {
  return (
    <div className="stitch-page relative w-full h-[800px] overflow-hidden overflow-y-auto rounded-xl border border-outline-variant/30 shadow-2xl bg-[#0e0e0e]" style={{ isolation: 'isolate' }}>
      
{/*  Ambient Lights  */}
<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-container/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-container/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
{/*  SideNavBar (Authority: JSON)  */}
<aside className="absolute left-0 top-0 h-full min-h-[800px] w-64 z-40 bg-[#0e0e0e]/80 backdrop-blur-2xl border-r border-[#e5bcc4]/15 flex flex-col p-6 space-y-4 shadow-2xl font-['Epilogue'] font-medium text-sm">
<div className="mb-10 px-2">
<h1 className="text-[#e5e2e1] font-black italic text-xl tracking-tighter">Obsidian Gallery</h1>
<p className="text-on-surface-variant/60 text-[10px] tracking-widest uppercase mt-1">System Settings</p>
</div>
<nav className="flex-1 space-y-2">
<div className="group flex items-center px-4 py-3 text-[#e5bcc4] hover:bg-[#353534]/30 cursor-pointer active:opacity-80 hover:translate-x-1 transition-all duration-200">
<span className="material-symbols-outlined mr-3" data-icon="dashboard">dashboard</span>
<span>Overview</span>
</div>
{/*  Active Navigation: General  */}
<div className="flex items-center px-4 py-3 bg-[#ff4b89]/20 text-[#ffb1c3] rounded-xl border-l-4 border-[#ff4b89] cursor-pointer active:opacity-80 shadow-lg">
<span className="material-symbols-outlined mr-3" data-icon="settings">settings</span>
<span>General</span>
</div>
<div className="group flex items-center px-4 py-3 text-[#e5bcc4] hover:bg-[#353534]/30 cursor-pointer active:opacity-80 hover:translate-x-1 transition-all duration-200">
<span className="material-symbols-outlined mr-3" data-icon="palette">palette</span>
<span>Branding</span>
</div>
<div className="group flex items-center px-4 py-3 text-[#e5bcc4] hover:bg-[#353534]/30 cursor-pointer active:opacity-80 hover:translate-x-1 transition-all duration-200">
<span className="material-symbols-outlined mr-3" data-icon="insights">insights</span>
<span>Analytics</span>
</div>
<div className="group flex items-center px-4 py-3 text-[#e5bcc4] hover:bg-[#353534]/30 cursor-pointer active:opacity-80 hover:translate-x-1 transition-all duration-200">
<span className="material-symbols-outlined mr-3" data-icon="lock">lock</span>
<span>Access</span>
</div>
</nav>
<div className="mt-auto space-y-4">
<button className="w-full vapor-gradient py-3 rounded-xl font-bold text-on-primary-fixed active:scale-95 transition-transform shadow-lg shadow-primary-container/20">
                Upgrade Plan
            </button>
<div className="pt-4 space-y-2">
<div className="flex items-center px-4 py-2 text-[#e5bcc4] hover:text-on-surface transition-colors cursor-pointer">
<span className="material-symbols-outlined mr-3" data-icon="help">help</span>
<span>Help</span>
</div>
<div className="flex items-center px-4 py-2 text-[#e5bcc4] hover:text-error transition-colors cursor-pointer">
<span className="material-symbols-outlined mr-3" data-icon="logout">logout</span>
<span>Logout</span>
</div>
</div>
</div>
</aside>
{/*  TopNavBar (Authority: JSON)  */}
<header className="absolute top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-xl flex justify-between items-center px-8 h-20 w-full shadow-[0_0_20px_rgba(255,75,137,0.08)]">
<div className="flex items-center gap-8 ml-64">
<span className="text-2xl font-bold tracking-tighter text-[#e5e2e1] font-['Epilogue']">Obsidian Gallery</span>
<nav className="hidden lg:flex items-center gap-6">
<a className="text-[#ffb1c3] border-b-2 border-[#ffb1c3] pb-1 font-['Epilogue'] tracking-tight transition-colors duration-300" href="#">Settings</a>
<a className="text-[#e5bcc4] hover:text-[#ffb1c3] font-['Epilogue'] tracking-tight transition-colors duration-300" href="#">Library</a>
<a className="text-[#e5bcc4] hover:text-[#ffb1c3] font-['Epilogue'] tracking-tight transition-colors duration-300" href="#">Curations</a>
</nav>
</div>
<div className="flex items-center gap-6">
<div className="relative group">
<input className="bg-[#353534]/10 border-none rounded-full px-6 py-2 w-64 text-sm focus:ring-1 focus:ring-secondary-container transition-all" placeholder="Search parameters..." type="text"/>
<span className="material-symbols-outlined absolute right-4 top-2 text-[#e5bcc4]" data-icon="search">search</span>
</div>
<div className="flex items-center gap-4 text-[#ffb1c3]">
<button className="material-symbols-outlined hover:scale-110 transition-transform" data-icon="notifications">notifications</button>
<button className="material-symbols-outlined hover:scale-110 transition-transform" data-icon="settings">settings</button>
<div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-primary/20 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="User profile portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbxUFwC5Fx4tUYBTvHN6z3NpBlXZnGIfDnMJy8wgJJX9QzIOit880WQJ7fd-spKn8M6PpTgVjcQsa4g_YVbThRKiKw7bV9gZy-lS9-vInSxOsYNWFSN-ie1eXg8W7rrLf6MEF_7JR547_tx7nOjr7sfjzxpdcpmeTczxvTNBhpj7Wpa-BTV4_f58b8C_6aYJJ2tY-DMvzKiHnJTHVhY0uhy90hPd3T4jYnNAnwhS4Wbf79Vax-ACAlZiqiF5EYGpTf1nFZK-GP0O4"/>
</div>
</div>
</div>
</header>
{/*  Main Content  */}
<main className="pl-64 pt-20 min-h-full min-h-[800px] relative z-10">
<div className="p-12 max-w-[1600px] mx-auto">
{/*  Header Section  */}
<header className="mb-16">
<h2 className="text-7xl font-black font-headline tracking-tighter mb-4 text-on-surface">General Settings</h2>
<p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed">Refine the architectural core of your digital sanctuary. Control assets, navigation behavior, and system metadata.</p>
</header>
{/*  Grid Layout  */}
<div className="grid grid-cols-12 gap-12">
{/*  Settings Horizontal Carousel Section  */}
<div className="col-span-12 xl:col-span-8 overflow-hidden">
<div className="flex items-center justify-between mb-8">
<h3 className="text-2xl font-bold font-headline text-primary">Core Modules</h3>
<div className="flex gap-2">
<button className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-surface-bright transition-colors">
<span className="material-symbols-outlined text-sm" data-icon="chevron_left">chevron_left</span>
</button>
<button className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-surface-bright transition-colors">
<span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
{/*  Horizontal Scroll Container  */}
<div className="flex gap-8 overflow-x-auto no-scrollbar pb-8 snap-x">
{/*  Card 1: App Details  */}
<div className="snap-start min-w-[420px] glass-card ghost-border rounded-3xl p-8 flex flex-col justify-between group hover:border-primary/40 transition-all duration-500">
<div>
<div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
<span className="material-symbols-outlined text-primary text-3xl" data-icon="info">info</span>
</div>
<h4 className="text-3xl font-bold font-headline mb-4 text-[#e5e2e1]">App Details</h4>
<div className="space-y-4">
<div className="flex justify-between items-center py-2 border-b border-white/5">
<span className="text-on-surface-variant text-sm font-label">Version</span>
<span className="text-secondary font-mono text-sm">v2.4.8-obsidian</span>
</div>
<div className="flex justify-between items-center py-2 border-b border-white/5">
<span className="text-on-surface-variant text-sm font-label">Uptime</span>
<span className="text-on-surface text-sm">99.98%</span>
</div>
<div className="flex justify-between items-center py-2">
<span className="text-on-surface-variant text-sm font-label">Environment</span>
<span className="px-2 py-0.5 rounded bg-secondary-container/20 text-secondary text-[10px] font-bold uppercase tracking-widest">Production</span>
</div>
</div>
</div>
<button className="mt-8 text-secondary font-label text-sm flex items-center gap-2 hover:translate-x-2 transition-transform">
                                Edit Metadata <span className="material-symbols-outlined text-xs" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
{/*  Card 2: App Assets  */}
<div className="snap-start min-w-[420px] glass-card ghost-border rounded-3xl p-8 flex flex-col justify-between group hover:border-secondary/40 transition-all duration-500">
<div>
<div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
<span className="material-symbols-outlined text-secondary text-3xl" data-icon="inventory_2">inventory_2</span>
</div>
<h4 className="text-3xl font-bold font-headline mb-4 text-[#e5e2e1]">App Assets</h4>
<div className="grid grid-cols-2 gap-4">
<div className="bg-surface-container-lowest/50 p-4 rounded-2xl flex items-center gap-3">
<span className="material-symbols-outlined text-primary" data-icon="image">image</span>
<div>
<p className="text-lg font-bold">1,204</p>
<p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Images</p>
</div>
</div>
<div className="bg-surface-container-lowest/50 p-4 rounded-2xl flex items-center gap-3">
<span className="material-symbols-outlined text-secondary" data-icon="video_library">video_library</span>
<div>
<p className="text-lg font-bold">84</p>
<p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Media</p>
</div>
</div>
</div>
<div className="mt-4 p-4 rounded-2xl bg-surface-container-lowest/30 flex items-center justify-between">
<span className="text-sm text-on-surface-variant">Storage Utilization</span>
<div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-secondary-container w-[65%]"></div>
</div>
</div>
</div>
<button className="mt-8 text-secondary font-label text-sm flex items-center gap-2 hover:translate-x-2 transition-transform">
                                Manage Files <span className="material-symbols-outlined text-xs" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
{/*  Card 3: NavBar & AppBar  */}
<div className="snap-start min-w-[420px] glass-card ghost-border rounded-3xl p-8 flex flex-col justify-between group hover:border-primary-container/40 transition-all duration-500">
<div>
<div className="w-14 h-14 rounded-2xl bg-tertiary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
<span className="material-symbols-outlined text-tertiary text-3xl" data-icon="layers">layers</span>
</div>
<h4 className="text-3xl font-bold font-headline mb-4 text-[#e5e2e1]">Interface Hub</h4>
<div className="flex gap-4 mb-4">
<div className="flex-1 aspect-video bg-surface-container-low rounded-xl border border-white/10 p-2 flex flex-col gap-1">
<div className="h-1.5 w-full bg-primary/40 rounded-full"></div>
<div className="flex-1 flex gap-1">
<div className="w-2 h-full bg-surface-container-highest rounded-sm"></div>
<div className="flex-1 bg-surface-container-highest/20 rounded-sm"></div>
</div>
<p className="text-[8px] text-center text-on-surface-variant mt-1 uppercase font-label tracking-tighter">Top + Side</p>
</div>
<div className="flex-1 aspect-video bg-surface-container-low rounded-xl border border-white/10 p-2 flex flex-col gap-1 ring-1 ring-primary/60">
<div className="flex-1 bg-surface-container-highest/20 rounded-sm"></div>
<div className="h-2 w-full bg-secondary/40 rounded-full flex justify-around items-center px-2">
<div className="w-1 h-1 bg-white rounded-full"></div>
<div className="w-1 h-1 bg-white rounded-full"></div>
<div className="w-1 h-1 bg-white rounded-full"></div>
</div>
<p className="text-[8px] text-center text-secondary mt-1 uppercase font-label tracking-tighter">Bottom Nav</p>
</div>
</div>
<p className="text-xs text-on-surface-variant italic">Active: Minimalist Hybrid Layout</p>
</div>
<button className="mt-8 text-secondary font-label text-sm flex items-center gap-2 hover:translate-x-2 transition-transform">
                                Layout Config <span className="material-symbols-outlined text-xs" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
</div>
{/*  Recent Updates Panel  */}
<div className="col-span-12 xl:col-span-4">
<div className="glass-card ghost-border rounded-3xl p-8 sticky top-28">
<div className="flex items-center justify-between mb-8">
<h3 className="text-xl font-bold font-headline">Recent Updates</h3>
<span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer" data-icon="history">history</span>
</div>
<div className="space-y-6">
{/*  Update 1  */}
<div className="flex gap-4 group">
<div className="flex flex-col items-center">
<div className="w-2 h-2 rounded-full bg-primary mb-2 shadow-[0_0_8px_#ff4b89]"></div>
<div className="w-[1px] h-full bg-outline-variant/30"></div>
</div>
<div className="pb-6">
<p className="text-xs text-on-surface-variant font-label mb-1">2 hours ago</p>
<h5 className="text-sm font-bold text-[#e5e2e1] group-hover:text-primary transition-colors">API Endpoint Rotation</h5>
<p className="text-xs text-on-surface-variant/80 mt-1 leading-relaxed">Updated core gallery fetch parameters for improved latency in EU-West regions.</p>
</div>
</div>
{/*  Update 2  */}
<div className="flex gap-4 group">
<div className="flex flex-col items-center">
<div className="w-2 h-2 rounded-full bg-secondary mb-2 shadow-[0_0_8px_#00eefc]"></div>
<div className="w-[1px] h-full bg-outline-variant/30"></div>
</div>
<div className="pb-6">
<p className="text-xs text-on-surface-variant font-label mb-1">Yesterday, 14:20</p>
<h5 className="text-sm font-bold text-[#e5e2e1] group-hover:text-secondary transition-colors">Asset Compression Toggle</h5>
<p className="text-xs text-on-surface-variant/80 mt-1 leading-relaxed">Global image optimization set to "High Fidelity" (Lossless WebP enabled).</p>
</div>
</div>
{/*  Update 3  */}
<div className="flex gap-4 group">
<div className="flex flex-col items-center">
<div className="w-2 h-2 rounded-full bg-on-surface-variant/40 mb-2"></div>
<div className="w-[1px] h-full bg-outline-variant/30 opacity-0"></div>
</div>
<div>
<p className="text-xs text-on-surface-variant font-label mb-1">Oct 24, 09:12</p>
<h5 className="text-sm font-bold text-[#e5e2e1]">Security Audit Complete</h5>
<p className="text-xs text-on-surface-variant/80 mt-1 leading-relaxed">Monthly system-wide permission sweep performed by Admin Root.</p>
</div>
</div>
</div>
<button className="w-full mt-8 py-3 rounded-xl border border-outline-variant/30 text-xs font-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors">
                            Full Activity Log
                        </button>
</div>
</div>
</div>
{/*  Bento Stats Section  */}
<section className="mt-20">
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
<div className="bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between border border-white/5 h-64">
<span className="material-symbols-outlined text-primary-container text-4xl" data-icon="bolt">bolt</span>
<div>
<p className="text-4xl font-black font-headline tracking-tighter">42ms</p>
<p className="text-on-surface-variant font-label text-sm uppercase tracking-widest mt-2">Average Response</p>
</div>
</div>
<div className="bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between border border-white/5 h-64 relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 vapor-gradient opacity-10 blur-3xl rounded-full"></div>
<span className="material-symbols-outlined text-secondary-container text-4xl" data-icon="cloud_sync">cloud_sync</span>
<div>
<p className="text-4xl font-black font-headline tracking-tighter">94.2 TB</p>
<p className="text-on-surface-variant font-label text-sm uppercase tracking-widest mt-2">Total Data Processed</p>
</div>
</div>
<div className="bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between border border-white/5 h-64">
<span className="material-symbols-outlined text-primary text-4xl" data-icon="verified_user">verified_user</span>
<div>
<p className="text-4xl font-black font-headline tracking-tighter">A+</p>
<p className="text-on-surface-variant font-label text-sm uppercase tracking-widest mt-2">Security Rating</p>
</div>
</div>
</div>
</section>
</div>
{/*  Footer Footer (Minimalist Editorial)  */}
<footer className="p-12 border-t border-white/5 flex justify-between items-center text-[10px] text-on-surface-variant uppercase tracking-[0.3em]">
<div>© 2024 Obsidian Gallery Systems. All rights reserved.</div>
<div className="flex gap-8">
<a className="hover:text-primary transition-colors" href="#">Privacy Protocol</a>
<a className="hover:text-primary transition-colors" href="#">Security Manifest</a>
<a className="hover:text-primary transition-colors" href="#">System Status</a>
</div>
</footer>
</main>
{/*  Contextual FAB (Suppressed on Settings Page as per UX Goal)  */}

    </div>
  );
}

export function PageDesignSystemStitch() {
  return (
    <div className="stitch-page relative w-full h-[800px] overflow-hidden overflow-y-auto rounded-xl border border-outline-variant/30 shadow-2xl bg-[#0e0e0e]" style={{ isolation: 'isolate' }}>
      
{/*  TopNavBar  */}
<nav className="absolute top-0 w-full z-50 bg-[#0e0e0f]/80 backdrop-blur-xl shadow-[0_0_15px_rgba(255,0,122,0.05)]">
<div className="flex justify-between items-center px-6 h-16 w-full">
<div className="text-[#ff007a] font-black tracking-tighter text-xl font-headline">ADVANCED_CAPABILITIES</div>
<div className="hidden md:flex items-center gap-8">
<a className="font-['Epilogue'] tracking-tight font-bold uppercase text-sm text-slate-400 hover:text-[#ff007a] transition-colors" href="#">Media</a>
<a className="font-['Epilogue'] tracking-tight font-bold uppercase text-sm text-[#ccff00] border-b-2 border-[#ccff00] pb-1" href="#">Motion</a>
<a className="font-['Epilogue'] tracking-tight font-bold uppercase text-sm text-slate-400 hover:text-[#ff007a] transition-colors" href="#">Architecture</a>
</div>
<div className="flex items-center gap-4">
<button className="material-symbols-outlined text-slate-400 hover:bg-[#1a191b] transition-all duration-200 p-2 active:scale-95" data-icon="settings">settings</button>
<button className="material-symbols-outlined text-slate-400 hover:bg-[#1a191b] transition-all duration-200 p-2 active:scale-95" data-icon="terminal">terminal</button>
</div>
</div>
<div className="bg-[#131314] h-[1px] w-full self-end"></div>
</nav>
{/*  SideNavBar  */}
<aside className="hidden md:flex h-full min-h-[800px] w-64 absolute left-0 top-0 pt-20 bg-[#131314] flex-col overflow-y-auto z-40">
<div className="px-6 mb-8">
<h2 className="text-[#ccff00] font-mono font-['SpaceGrotesk'] font-medium text-xs uppercase tracking-widest mb-1">CAPABILITIES</h2>
<p className="font-mono text-[10px] text-slate-500">v4.0.2-STABLE</p>
</div>
<nav className="flex-1 flex flex-col">
<a className="transition-all duration-300 ease-in-out text-slate-500 px-4 py-3 flex items-center gap-3 hover:bg-[#1a191b] hover:text-[#ff007a] font-['SpaceGrotesk'] font-medium text-xs uppercase tracking-widest" href="#">
<span className="material-symbols-outlined" data-icon="folder_open">folder_open</span>
<span>File Handling</span>
</a>
<a className="transition-all duration-300 ease-in-out text-slate-500 px-4 py-3 flex items-center gap-3 hover:bg-[#1a191b] hover:text-[#ff007a] font-['SpaceGrotesk'] font-medium text-xs uppercase tracking-widest" href="#">
<span className="material-symbols-outlined" data-icon="code">code</span>
<span>Custom Code</span>
</a>
<a className="transition-all duration-300 ease-in-out bg-[#1a191b] text-[#ccff00] border-l-4 border-[#ccff00] px-4 py-3 flex items-center gap-3 font-['SpaceGrotesk'] font-medium text-xs uppercase tracking-widest" href="#">
<span className="material-symbols-outlined" data-icon="movie_filter">movie_filter</span>
<span>Animations</span>
</a>
<a className="transition-all duration-300 ease-in-out text-slate-500 px-4 py-3 flex items-center gap-3 hover:bg-[#1a191b] hover:text-[#ff007a] font-['SpaceGrotesk'] font-medium text-xs uppercase tracking-widest" href="#">
<span className="material-symbols-outlined" data-icon="api">api</span>
<span>API Config</span>
</a>
<a className="transition-all duration-300 ease-in-out text-slate-500 px-4 py-3 flex items-center gap-3 hover:bg-[#1a191b] hover:text-[#ff007a] font-['SpaceGrotesk'] font-medium text-xs uppercase tracking-widest" href="#">
<span className="material-symbols-outlined" data-icon="verified_user">verified_user</span>
<span>Security Architecture</span>
</a>
</nav>
<div className="px-4 py-6 border-t border-[#1a191b]">
<button className="w-full bg-[#ccff00] text-[#003f43] font-['SpaceGrotesk'] font-bold text-[10px] py-3 tracking-widest active:scale-95 transition-transform">
                DEPLOY CONFIG
            </button>
</div>
<div className="bg-gradient-to-b from-[#ff007a]/10 to-transparent w-[1px] h-full absolute right-0"></div>
</aside>
{/*  Main Content  */}
<main className="md:ml-64 pt-24 px-6 md:px-12 pb-24 bg-grid-pattern min-h-full min-h-[800px]">
{/*  Header Section  */}
<header className="max-w-6xl mb-24">
<span className="font-label text-secondary tracking-[0.3em] text-[10px] uppercase mb-4 block">CORE_MODULE_01</span>
<h1 className="font-headline text-5xl md:text-8xl font-black text-on-background tracking-tighter leading-none mb-8">
                Advanced Capabilities:<br/>
<span className="text-primary-fixed">Media &amp; Motion</span>
</h1>
<div className="flex gap-4 items-center">
<div className="h-[2px] w-24 bg-secondary"></div>
<p className="font-label text-slate-400 text-sm uppercase tracking-wider">High-Fidelity Rendering &amp; Logic Engine</p>
</div>
</header>
{/*  Asymmetrical Feature Grid  */}
<div className="max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-y-32">
{/*  Card 1: File Handling  */}
<div className="md:col-span-7 bg-surface-container/60 backdrop-blur-xl p-10 border-l-2 border-primary-container relative group">
<div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
<div className="flex justify-between items-start mb-12">
<span className="material-symbols-outlined text-primary-fixed text-4xl neon-glow-pink" data-icon="folder_open">folder_open</span>
<span className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label text-[10px] tracking-tighter flex items-center gap-2">
<span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span>
                        ACTIVE_READY
                    </span>
</div>
<h3 className="font-headline text-3xl font-bold mb-4 tracking-tight">File Handling</h3>
<p className="text-on-surface-variant leading-relaxed mb-8 max-w-md">
                    Automated asset ingestion with real-time compression algorithms. Supports raw binary stream processing for high-volume media architecture.
                </p>
<div className="flex flex-wrap gap-2">
<span className="bg-surface-container-highest px-4 py-1 font-label text-[10px] text-outline">MP4_ULTRA</span>
<span className="bg-surface-container-highest px-4 py-1 font-label text-[10px] text-outline">RAW_BEX</span>
<span className="bg-surface-container-highest px-4 py-1 font-label text-[10px] text-outline">WEBP_STATIC</span>
</div>
</div>
{/*  Card 2: Custom Code (Offset)  */}
<div className="md:col-span-5 md:mt-24 bg-surface-container-low p-8 border-t border-outline-variant/20 relative">
<div className="flex flex-col h-full">
<div className="flex justify-between items-center mb-8">
<span className="material-symbols-outlined text-secondary text-4xl neon-glow-lime" data-icon="code">code</span>
<div className="text-right">
<p className="font-label text-[10px] text-slate-500 uppercase">Latency</p>
<p className="font-label text-sm text-secondary">0.002ms</p>
</div>
</div>
<h3 className="font-headline text-2xl font-bold mb-4 tracking-tight">Custom Code</h3>
<p className="text-on-surface-variant text-sm leading-relaxed mb-12">
                        Inject bespoke logic directly into the motion pipeline using our proprietary schematic language.
                    </p>
<button className="mt-auto border border-primary/30 text-primary-fixed px-6 py-3 font-label text-xs tracking-widest hover:bg-primary/10 transition-all uppercase">
                        Access Scripting Environment
                    </button>
</div>
</div>
{/*  Interactive Code Block Area  */}
<div className="md:col-span-12 bg-[#000000] p-1 border border-outline-variant/10 shadow-2xl">
<div className="bg-surface-container px-6 py-3 flex justify-between items-center">
<div className="flex gap-2">
<div className="w-3 h-3 bg-error-container"></div>
<div className="w-3 h-3 bg-surface-variant"></div>
<div className="w-3 h-3 bg-secondary-container"></div>
</div>
<span className="font-label text-[10px] text-slate-500 uppercase tracking-widest">motion_engine.sh</span>
</div>
<div className="p-8 font-mono text-sm leading-relaxed overflow-x-auto">
<div className="flex gap-6">
<div className="text-outline/40 select-none text-right w-8">
                            01<br/>02<br/>03<br/>04<br/>05<br/>06<br/>07
                        </div>
<div className="text-on-surface-variant">
<span className="text-primary-fixed">function</span> <span className="text-secondary">init_kinetic_buffer</span>(stream_id) {"{"}<br/>
                              <span className="text-primary-fixed">const</span> node = <span className="text-secondary">SCHEMATIC</span>.load(stream_id);<br/>
                              <span className="text-slate-500">// Initialize GPU acceleration</span><br/>
                              node.<span className="text-secondary">set_acceleration</span>(<span className="text-tertiary-fixed">"FORCE_ULTRA"</span>);<br/>
                              <span className="text-primary-fixed">return</span> node.<span className="text-secondary">pipe</span>({"{"} format: <span className="text-tertiary-fixed">'GL_BUFFER'</span> {"}"});<br/>
                            {"}"}<br/>
<span className="text-secondary">init_kinetic_buffer</span>(<span className="text-tertiary-fixed">"A88-719B"</span>);
                        </div>
</div>
</div>
</div>
{/*  Card 3: Animations  */}
<div className="md:col-start-2 md:col-span-5 bg-surface-container-high p-10 border-r-2 border-secondary relative overflow-hidden">
<div className="absolute top-0 right-0 p-4">
<span className="material-symbols-outlined text-outline/20 text-8xl" data-icon="movie_filter">movie_filter</span>
</div>
<div className="relative z-10">
<h3 className="font-headline text-3xl font-bold mb-6 tracking-tight">Animations</h3>
<p className="text-on-surface-variant mb-10 leading-relaxed">
                        Procedural motion synthesis that responds to real-time data inputs. Create complex physics-based interactions with zero frame drops.
                    </p>
<div className="grid grid-cols-2 gap-4">
<div className="bg-surface-container-lowest p-4">
<p className="font-label text-[10px] text-slate-500 mb-1 uppercase">FPS_STABILITY</p>
<p className="text-secondary font-headline text-xl">120.00</p>
</div>
<div className="bg-surface-container-lowest p-4">
<p className="font-label text-[10px] text-slate-500 mb-1 uppercase">SYNC_MODE</p>
<p className="text-primary-fixed font-headline text-xl">ULTRA</p>
</div>
</div>
</div>
</div>
{/*  Visual Graphic Card  */}
<div className="md:col-span-5 md:mt-[-4rem] h-[400px] relative bg-surface-container-low group overflow-hidden">
<img alt="Abstract digital network" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700 scale-110 group-hover:scale-100" data-alt="Abstract vibrant digital glowing network connections" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiLGboyG4miUar5SM9pndF3zqPPbTPLmx8t0-wm-vIFJnqgrTGLsX6pMli06uZdzsojK6LvShdGqS048fTfbm1FaeEJV41myMclDRAayoO2u22MuzvbYv5oKnmRaM8GnetdSLDaMvXHBdFjJ6-LTQ7M2pTdiKFfrUZDKN7W1k8UT5sBcgWTQd_mwpeCCyuz9Fv3hdC3DiXTXSpAuDboJDiC0T4QaXW1WuHmOi2HOtXD9xqQRqb8NoZ2ZSE7_Bn9AuTgeu3uHFkwa0"/>
<div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
<div className="absolute bottom-8 left-8">
<p className="font-label text-xs tracking-widest text-secondary mb-2 uppercase">System_Visual_Output</p>
<h4 className="font-headline text-xl font-bold">KINETIC_FLOW_RENDER</h4>
</div>
</div>
</div>
</main>
{/*  Footer  */}
<footer className="md:ml-64 bg-[#0e0e0f] border-t border-[#1a191b] w-full py-4 mt-auto">
<div className="flex justify-between items-center px-8 w-full">
<div className="flex items-center gap-6">
<span className="font-bold text-[#ff007a] font-headline text-sm">KINETIC_SCHEMATIC</span>
<span className="font-mono text-[10px] tracking-tighter text-slate-500">© 2024 | BUILD_ID: 88A9-719B</span>
</div>
<div className="flex gap-8">
<a className="font-mono text-[10px] tracking-tighter text-[#ccff00] underline" href="#">System Status: OPERATIONAL</a>
<a className="font-mono text-[10px] tracking-tighter text-slate-600 hover:text-[#ff007a] transition-colors" href="#">API: v2.4</a>
<a className="font-mono text-[10px] tracking-tighter text-slate-600 hover:text-[#ff007a] transition-colors" href="#">Privacy_Protocol</a>
</div>
</div>
</footer>

    </div>
  );
}

export function PageStateManagementStitch() {
  return (
    <div className="stitch-page relative w-full h-[800px] overflow-hidden overflow-y-auto rounded-xl border border-outline-variant/30 shadow-2xl bg-[#0e0e0e]" style={{ isolation: 'isolate' }}>
      
{/*  TopNavBar  */}
<header className="absolute top-0 w-full z-50 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-[#ffffff]/10 shadow-[0px_20px_40px_rgba(199,153,255,0.08)]">
<div className="flex justify-between items-center px-8 h-20 w-full">
<div className="flex items-center gap-8">
<span className="text-2xl font-black text-[#c799ff] tracking-tighter font-headline">Obsidian Gallery</span>
<nav className="hidden md:flex gap-6 items-center">
<a className="text-[#ffffff]/60 hover:text-[#ffffff] transition-colors font-headline font-bold tracking-tight" href="#">Explore</a>
<a className="text-[#c799ff] border-b-2 border-[#c799ff] pb-1 font-headline font-bold tracking-tight" href="#">Project Basics</a>
<a className="text-[#ffffff]/60 hover:text-[#ffffff] transition-colors font-headline font-bold tracking-tight" href="#">Showcase</a>
</nav>
</div>
<div className="flex items-center gap-4">
<div className="relative hidden lg:block">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="bg-surface-container-highest/40 border-none rounded-full pl-10 pr-4 py-2 w-64 focus:ring-1 focus:ring-primary text-sm" placeholder="Search insights..." type="text"/>
</div>
<button className="p-2 rounded-full hover:bg-[#ffffff]/5 transition-all active:scale-95 duration-200">
<span className="material-symbols-outlined text-[#c799ff]">notifications</span>
</button>
<button className="p-2 rounded-full hover:bg-[#ffffff]/5 transition-all active:scale-95 duration-200">
<span className="material-symbols-outlined text-[#c799ff]">account_circle</span>
</button>
</div>
</div>
</header>
{/*  SideNavBar (Desktop Only)  */}
<aside className="absolute left-0 top-0 h-full w-72 z-40 pt-24 hidden md:flex flex-col gap-2 p-6 bg-[#131313] bg-gradient-to-r from-[#131313] to-[#0e0e0e] shadow-2xl border-r border-[#ffffff]/5">
<div className="mb-8 px-2">
<h2 className="text-[#c799ff] font-bold font-headline">Project Explainer</h2>
<p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Educational Series</p>
</div>
<nav className="flex-1 flex flex-col gap-2">
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#ffffff]/50 hover:bg-[#ffffff]/5 hover:text-[#ffffff] transition-all hover:translate-x-1 duration-200" href="#">
<span className="material-symbols-outlined">auto_awesome</span>
<span className="font-['Manrope'] font-medium text-sm">Curated Content</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#c799ff]/10 text-[#c799ff] font-bold hover:translate-x-1 transition-all" href="#">
<span className="material-symbols-outlined">architecture</span>
<span className="font-['Manrope'] font-medium text-sm">Project Basics</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#ffffff]/50 hover:bg-[#ffffff]/5 hover:text-[#ffffff] transition-all hover:translate-x-1 duration-200" href="#">
<span className="material-symbols-outlined">layers</span>
<span className="font-['Manrope'] font-medium text-sm">Advanced Workflows</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#ffffff]/50 hover:bg-[#ffffff]/5 hover:text-[#ffffff] transition-all hover:translate-x-1 duration-200" href="#">
<span className="material-symbols-outlined">menu_book</span>
<span className="font-['Manrope'] font-medium text-sm">Glossary</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#ffffff]/50 hover:bg-[#ffffff]/5 hover:text-[#ffffff] transition-all hover:translate-x-1 duration-200" href="#">
<span className="material-symbols-outlined">collections</span>
<span className="font-['Manrope'] font-medium text-sm">Gallery Archive</span>
</a>
</nav>
<div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-2">
<button className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-bold py-3 rounded-lg text-sm mb-4 active:opacity-80 transition-all">
                Start Learning
            </button>
<a className="flex items-center gap-3 px-4 py-2 text-[#ffffff]/50 hover:text-white transition-colors" href="#">
<span className="material-symbols-outlined text-sm">settings</span>
<span className="text-xs font-label">Settings</span>
</a>
<a className="flex items-center gap-3 px-4 py-2 text-[#ffffff]/50 hover:text-white transition-colors" href="#">
<span className="material-symbols-outlined text-sm">help_outline</span>
<span className="text-xs font-label">Support</span>
</a>
</div>
</aside>
{/*  Main Canvas  */}
<main className="md:ml-72 pt-32 pb-20 px-8 min-h-full min-h-[800px]">
<div className="max-w-7xl mx-auto">
{/*  Hero Header Section  */}
<section className="mb-16">
<span className="text-tertiary font-label text-sm tracking-widest uppercase mb-4 block">Module 01: Fundamentals</span>
<h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter mb-6 bg-gradient-to-br from-on-surface via-on-surface to-primary bg-clip-text text-transparent">
                    What is a Project?
                </h1>
<p className="max-w-2xl text-xl text-on-surface-variant font-body leading-relaxed">
                    Beyond simple tasks lies the architecture of intentionality. A project is a temporary endeavor undertaken to create a unique product, service, or result.
                </p>
</section>
{/*  Main Content Grid  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
{/*  Left Side: Interactive Infographic Area  */}
<div className="lg:col-span-7 relative group">
<div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
<div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]"></div>
<div className="glass-card rounded-[2rem] overflow-hidden border border-outline-variant/15 shadow-2xl min-h-[600px] flex flex-col p-8 relative z-10">
<div className="flex justify-between items-center mb-12">
<div className="flex gap-2">
<div className="w-3 h-3 rounded-full bg-error/40"></div>
<div className="w-3 h-3 rounded-full bg-primary/40"></div>
<div className="w-3 h-3 rounded-full bg-secondary/40"></div>
</div>
<span className="font-label text-xs text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">Interactive Visualizer v2.4</span>
</div>
<div className="flex-1 flex items-center justify-center">
<div className="relative w-full aspect-square max-w-md">
{/*  Abstract Infographic Logic  */}
<div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
<div className="absolute inset-10 border border-secondary/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
<div className="absolute inset-0 flex items-center justify-center">
<div className="relative glass-card w-40 h-40 rounded-3xl border border-primary/30 flex flex-col items-center justify-center gap-2 neon-border-glow">
<span className="material-symbols-outlined text-4xl text-primary" style={{fontVariationSettings: `'FILL' 1`}}>deployed_code</span>
<span className="font-label text-[10px] uppercase tracking-tighter text-primary">The Core</span>
</div>
{/*  Orbiting Elements  */}
<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-card p-4 rounded-xl border border-secondary/20">
<span className="material-symbols-outlined text-secondary">schedule</span>
<div className="mt-1 font-label text-[9px] text-on-surface-variant">TIMELINE</div>
</div>
<div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 glass-card p-4 rounded-xl border border-tertiary/20">
<span className="material-symbols-outlined text-tertiary">payments</span>
<div className="mt-1 font-label text-[9px] text-on-surface-variant">BUDGET</div>
</div>
<div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 glass-card p-4 rounded-xl border border-primary/20">
<span className="material-symbols-outlined text-primary">group</span>
<div className="mt-1 font-label text-[9px] text-on-surface-variant">RESOURCES</div>
</div>
</div>
</div>
</div>
<div className="mt-8 grid grid-cols-3 gap-4">
<div className="bg-surface-container/50 p-4 rounded-xl">
<h4 className="font-headline font-bold text-sm text-on-surface mb-1">Defined End</h4>
<p className="text-[10px] text-on-surface-variant leading-tight">Projects are temporary. They have a specific finish line.</p>
</div>
<div className="bg-surface-container/50 p-4 rounded-xl border-b-2 border-secondary">
<h4 className="font-headline font-bold text-sm text-on-surface mb-1">Unique Value</h4>
<p className="text-[10px] text-on-surface-variant leading-tight">Every project creates something that didn't exist before.</p>
</div>
<div className="bg-surface-container/50 p-4 rounded-xl">
<h4 className="font-headline font-bold text-sm text-on-surface mb-1">Progressive</h4>
<p className="text-[10px] text-on-surface-variant leading-tight">Development happens in steps, increasing in detail.</p>
</div>
</div>
</div>
{/*  Caption  */}
<p className="mt-6 text-sm italic text-on-surface-variant text-center font-label">
                        Fig 1.1: The 'Iron Triangle' within the obsidian ecosystem.
                    </p>
</div>
{/*  Right Side: 3-Step Process Breakdown  */}
<div className="lg:col-span-5 flex flex-col gap-6">
{/*  Step 1  */}
<div className="glass-card p-8 rounded-2xl border-l-4 border-primary/40 relative overflow-hidden group hover:border-primary transition-all duration-300">
<div className="flex items-start gap-6 relative z-10">
<div className="flex flex-col items-center">
<span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-label border border-primary/20">01</span>
<div className="w-px h-full bg-gradient-to-b from-primary/30 to-transparent mt-4"></div>
</div>
<div className="flex-1">
<h3 className="text-2xl font-black font-headline mb-3 text-on-surface tracking-tight group-hover:text-primary transition-colors">Inception &amp; Scope</h3>
<p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                                    Determining what needs to be achieved. This phase defines the boundaries, goals, and the "why" behind the effort.
                                </p>
<div className="flex gap-2">
<span className="text-[10px] font-label px-2 py-0.5 rounded bg-surface-container-highest/60 text-primary">OBJECTIVE</span>
<span className="text-[10px] font-label px-2 py-0.5 rounded bg-surface-container-highest/60 text-on-surface-variant">FEASIBILITY</span>
</div>
</div>
</div>
<div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-6xl text-primary">lightbulb</span>
</div>
</div>
{/*  Step 2  */}
<div className="glass-card p-8 rounded-2xl border-l-4 border-secondary/40 relative overflow-hidden group hover:border-secondary transition-all duration-300">
<div className="flex items-start gap-6 relative z-10">
<div className="flex flex-col items-center">
<span className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold font-label border border-secondary/20">02</span>
<div className="w-px h-full bg-gradient-to-b from-secondary/30 to-transparent mt-4"></div>
</div>
<div className="flex-1">
<h3 className="text-2xl font-black font-headline mb-3 text-on-surface tracking-tight group-hover:text-secondary transition-colors">Strategic Execution</h3>
<p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                                    The active phase of building. Here, resources are deployed and the vision begins to take physical or digital form through iterative sprints.
                                </p>
<div className="flex gap-2">
<span className="text-[10px] font-label px-2 py-0.5 rounded bg-surface-container-highest/60 text-secondary">ACTION</span>
<span className="text-[10px] font-label px-2 py-0.5 rounded bg-surface-container-highest/60 text-on-surface-variant">ITERATION</span>
</div>
</div>
</div>
<div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-6xl text-secondary">settings_slow_motion</span>
</div>
</div>
{/*  Step 3  */}
<div className="glass-card p-8 rounded-2xl border-l-4 border-tertiary/40 relative overflow-hidden group hover:border-tertiary transition-all duration-300">
<div className="flex items-start gap-6 relative z-10">
<div className="flex flex-col items-center">
<span className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary font-bold font-label border border-tertiary/20">03</span>
</div>
<div className="flex-1">
<h3 className="text-2xl font-black font-headline mb-3 text-on-surface tracking-tight group-hover:text-tertiary transition-colors">Synthesis &amp; Delivery</h3>
<p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                                    The final consolidation of work. Outcomes are verified against initial goals and the project transitions into a final deliverable state.
                                </p>
<div className="flex gap-2">
<span className="text-[10px] font-label px-2 py-0.5 rounded bg-surface-container-highest/60 text-tertiary">FINAL</span>
<span className="text-[10px] font-label px-2 py-0.5 rounded bg-surface-container-highest/60 text-on-surface-variant">VALIDATION</span>
</div>
</div>
</div>
<div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-6xl text-tertiary">verified</span>
</div>
</div>
{/*  Interaction Section  */}
<div className="mt-8 flex items-center justify-between gap-4">
<a className="flex-1 bg-surface-container border border-outline-variant/20 hover:bg-surface-container-highest text-on-surface text-center py-4 rounded-xl font-headline font-bold transition-all flex items-center justify-center gap-2" href="#">
                            Explore Archive
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
</a>
<button className="flex-1 bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed py-4 rounded-xl font-headline font-black tracking-wide shadow-xl shadow-primary/10 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            Next Lesson
                            <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
</div>
{/*  Bento Bottom Grid (Extra Context)  */}
<section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
<div className="glass-card p-8 rounded-3xl border border-outline-variant/10">
<span className="material-symbols-outlined text-primary mb-4" style={{fontVariationSettings: `'FILL' 1`}}>auto_mode</span>
<h5 className="font-headline font-bold text-lg mb-2">Automated Lifecycle</h5>
<p className="text-xs text-on-surface-variant font-body">Learn how modern projects leverage AI to predict bottleneck trends before they manifest.</p>
</div>
<div className="glass-card p-8 rounded-3xl border border-outline-variant/10 md:scale-105 bg-surface-container/80 z-20">
<span className="material-symbols-outlined text-secondary mb-4" style={{fontVariationSettings: `'FILL' 1`}}>diversity_3</span>
<h5 className="font-headline font-bold text-lg mb-2">Collaborative Design</h5>
<p className="text-xs text-on-surface-variant font-body">The human element remains the central nervous system of any successful project architecture.</p>
</div>
<div className="glass-card p-8 rounded-3xl border border-outline-variant/10">
<span className="material-symbols-outlined text-tertiary mb-4" style={{fontVariationSettings: `'FILL' 1`}}>monitoring</span>
<h5 className="font-headline font-bold text-lg mb-2">Impact Analytics</h5>
<p className="text-xs text-on-surface-variant font-body">Measure success not just by completion, but by the resonance of the final output.</p>
</div>
</section>
</div>
</main>
{/*  Footer Space  */}
<footer className="md:ml-72 p-12 bg-surface-container-low border-t border-white/5">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
<div className="flex flex-col gap-2">
<span className="text-xl font-black text-primary font-headline tracking-tighter">Obsidian Gallery</span>
<p className="text-xs text-on-surface-variant font-label">© 2024 Educational Series. All rights reserved.</p>
</div>
<div className="flex gap-8">
<a className="text-xs font-label text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a className="text-xs font-label text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
<a className="text-xs font-label text-on-surface-variant hover:text-primary transition-colors" href="#">Course Sitemap</a>
</div>
</div>
</footer>

    </div>
  );
}

export function PageFileHandlingStitch() {
  return (
    <div className="stitch-page relative w-full h-[800px] overflow-hidden overflow-y-auto rounded-xl border border-outline-variant/30 shadow-2xl bg-[#0e0e0e]" style={{ isolation: 'isolate' }}>
      
{/*  TopNavBar  */}
<nav className="absolute top-0 w-full z-50 bg-slate-950/40 backdrop-blur-xl border-b border-cyan-500/10 shadow-[0_0_15px_rgba(0,240,255,0.05)] flex justify-between items-center px-8 h-16 w-full transition-all duration-300 ease-in-out">
<div className="text-xl font-bold tracking-tighter text-cyan-400 font-headline uppercase">Synthetic Noir</div>
<div className="hidden md:flex items-center gap-8">
<a className="text-cyan-400 border-b-2 border-cyan-400 pb-1 font-headline tracking-tighter uppercase transition-all duration-300" href="#">Themes</a>
<a className="text-slate-400 hover:text-cyan-200 transition-colors font-headline tracking-tighter uppercase transition-all duration-300" href="#">Typography</a>
<a className="text-slate-400 hover:text-cyan-200 transition-colors font-headline tracking-tighter uppercase transition-all duration-300" href="#">Components</a>
<a className="text-slate-400 hover:text-cyan-200 transition-colors font-headline tracking-tighter uppercase transition-all duration-300" href="#">Motion</a>
</div>
<div className="flex items-center gap-4">
<button className="p-2 hover:bg-cyan-500/5 rounded transition-all">
<span className="material-symbols-outlined text-cyan-400" data-icon="dark_mode">dark_mode</span>
</button>
<button className="p-2 hover:bg-cyan-500/5 rounded transition-all">
<span className="material-symbols-outlined text-cyan-400" data-icon="search">search</span>
</button>
<div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-500/20">
<img alt="User profile" data-alt="Cyberpunk style user profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaVSr5jQqLthZatmpcbj0rGx4ZsF7qHZnFThW5sU5orlpcjJ5dvmzmy_BScgOkJYOjYYEzJTjpIOO4tBtgnOrvdKw7PhMC5i6fi8TOYUsjx5OrAtAWprrJjQvX8N6FI4twqmhkdQyckTjtxapUcFAO-Oybz2RYAZWXONcm4XOJ_runVp_nPYyNhBvxGzQdQVelmj-VerSBW28WY9oT3NTy-eDlgXVKtvjnZBd8vEtrkquVg6GJIPzdaykFDJsTkQUdgI-VUWdVBdI"/>
</div>
</div>
</nav>
<div className="flex pt-16">
{/*  SideNavBar  */}
<aside className="hidden lg:flex flex-col py-6 sticky top-16 h-[calc(100vh-64px)] w-64 border-r border-cyan-500/10 bg-slate-950/60 backdrop-blur-2xl transition-all">
<div className="px-4 mb-8">
<div className="text-lg font-black text-cyan-400 font-headline uppercase">Core Specs</div>
<div className="text-xs text-slate-500 font-medium">v1.0.4</div>
</div>
<nav className="flex-1 px-2 space-y-1">
<a className="flex items-center gap-3 px-4 py-3 text-cyan-400 bg-cyan-500/10 border-r-2 border-cyan-400 font-manrope text-sm font-medium transition-transform active:scale-95" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="dashboard">dashboard</span>
<span>Overview</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-cyan-200 hover:bg-slate-800/50 font-manrope text-sm font-medium transition-transform active:scale-95" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="palette">palette</span>
<span>Color Logic</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-cyan-200 hover:bg-slate-800/50 font-manrope text-sm font-medium transition-transform active:scale-95" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="match_case">match_case</span>
<span>Type Systems</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-cyan-200 hover:bg-slate-800/50 font-manrope text-sm font-medium transition-transform active:scale-95" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="grid_view">grid_view</span>
<span>Layout Rules</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-cyan-200 hover:bg-slate-800/50 font-manrope text-sm font-medium transition-transform active:scale-95" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="folder_zip">folder_zip</span>
<span>Assets</span>
</a>
</nav>
<div className="px-4 mt-auto space-y-4">
<button className="w-full py-2 bg-primary-container text-on-primary text-xs font-bold uppercase tracking-widest rounded transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                    Download UI Kit
                </button>
<div className="border-t border-cyan-500/10 pt-4 space-y-1">
<a className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-cyan-200 text-sm" href="#">
<span className="material-symbols-outlined text-[18px]" data-icon="settings">settings</span>
<span>Settings</span>
</a>
<a className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-cyan-200 text-sm" href="#">
<span className="material-symbols-outlined text-[18px]" data-icon="help">help</span>
<span>Support</span>
</a>
</div>
</div>
</aside>
{/*  Main Content Canvas  */}
<main className="flex-1 relative noir-grid min-h-full min-h-[800px]">
{/*  Hero Header  */}
<header className="pt-20 pb-12 px-8 md:px-16 max-w-7xl">
<p className="text-primary font-headline tracking-[0.3em] uppercase text-xs mb-4">Core Principles</p>
<h1 className="text-6xl md:text-8xl font-headline font-black text-tertiary tracking-tighter leading-none mb-6">
                    SYNTHETIC<br/><span className="text-primary">NOIR</span>
</h1>
<p className="text-on-surface-variant max-w-2xl font-body text-lg leading-relaxed">
                    A cinematic design framework built on intentional asymmetry and luminous depth. We replace traditional shadows with ambient light bleed to create a digital monolith.
                </p>
</header>
{/*  Bento Grid Section  */}
<section className="px-8 md:px-16 pb-24 max-w-7xl">
<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
{/*  Themes Bento Item  */}
<div className="md:col-span-8 bg-surface-container-low/60 backdrop-blur-md p-8 ghost-border rounded-xl flex flex-col justify-between overflow-hidden relative group">
<div className="relative z-10">
<div className="flex items-center gap-2 mb-4">
<span className="material-symbols-outlined text-primary text-sm" data-icon="auto_awesome">auto_awesome</span>
<h3 className="font-headline text-xl text-tertiary uppercase tracking-widest">Themes</h3>
</div>
<p className="text-on-surface-variant mb-8 max-w-md">Our visual modes adapt based on environment luminance while maintaining the noir aesthetic.</p>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
<div className="bg-surface-dim p-6 border border-primary/10 rounded-lg group-hover:border-primary/30 transition-all">
<div className="w-full h-12 bg-surface-container-highest rounded mb-4"></div>
<p className="text-xs font-headline text-primary uppercase tracking-tighter">Dark Mode</p>
<p className="text-[10px] text-slate-500 uppercase">Default state</p>
</div>
<div className="bg-tertiary p-6 rounded-lg">
<div className="w-full h-12 bg-slate-200 rounded mb-4"></div>
<p className="text-xs font-headline text-inverse-primary uppercase tracking-tighter">Light Mode</p>
<p className="text-[10px] text-slate-400 uppercase">High luminance</p>
</div>
<div className="bg-black p-6 border-2 border-primary/40 rounded-lg">
<div className="w-full h-12 bg-slate-900 rounded mb-4 border border-primary/20"></div>
<p className="text-xs font-headline text-white uppercase tracking-tighter">Contrast</p>
<p className="text-[10px] text-primary uppercase">Pure visibility</p>
</div>
</div>
</div>
<div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
<span className="material-symbols-outlined text-[200px]" data-icon="visibility">visibility</span>
</div>
</div>
{/*  Small Accent Card  */}
<div className="md:col-span-4 bg-secondary-container/10 backdrop-blur-md p-8 ghost-border rounded-xl flex flex-col justify-center items-center text-center border-secondary/20 group">
<span className="material-symbols-outlined text-5xl text-secondary mb-4" data-icon="flare" data-weight="fill">flare</span>
<h4 className="font-headline text-tertiary uppercase tracking-widest mb-2">Luminous Depth</h4>
<p className="text-on-surface-variant text-sm">Depth is not light, it's glow and translucency.</p>
</div>
{/*  Typography Bento Item  */}
<div className="md:col-span-5 bg-surface-container-low/60 backdrop-blur-md p-8 ghost-border rounded-xl flex flex-col">
<div className="flex items-center gap-2 mb-6">
<span className="material-symbols-outlined text-primary text-sm" data-icon="text_fields">text_fields</span>
<h3 className="font-headline text-xl text-tertiary uppercase tracking-widest">Typography</h3>
</div>
<div className="space-y-8">
<div className="group">
<p className="text-[10px] text-primary uppercase tracking-widest mb-2">Epilogue Display</p>
<h2 className="font-headline font-black text-4xl text-tertiary tracking-tighter group-hover:text-primary transition-colors">ARCHITECTURAL</h2>
</div>
<div>
<p className="text-[10px] text-secondary uppercase tracking-widest mb-2">Manrope Body</p>
<p className="font-body text-on-surface-variant leading-relaxed">
                                    Functional readability for the technical elite. Designed for clarity in low-light environments.
                                </p>
</div>
<div className="bg-surface-container-highest/40 p-4 rounded-lg">
<p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Monospaced Functional</p>
<code className="text-sm font-mono text-cyan-200">System.inject(NOIR_ESTHETIC);</code>
</div>
</div>
</div>
{/*  Color Palette Bento Item  */}
<div className="md:col-span-7 bg-surface-container-low/60 backdrop-blur-md p-8 ghost-border rounded-xl">
<div className="flex items-center gap-2 mb-8">
<span className="material-symbols-outlined text-primary text-sm" data-icon="palette">palette</span>
<h3 className="font-headline text-xl text-tertiary uppercase tracking-widest">Color Spectrum</h3>
</div>
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 h-64">
<div className="bg-primary-container p-4 rounded-lg flex flex-col justify-end group transition-all hover:scale-[1.02]">
<span className="text-[10px] font-bold text-on-primary uppercase">Primary</span>
<span className="text-xs font-mono text-on-primary/60">#00F0FF</span>
</div>
<div className="bg-secondary-container p-4 rounded-lg flex flex-col justify-end group transition-all hover:scale-[1.02]">
<span className="text-[10px] font-bold text-on-secondary-container uppercase">Secondary</span>
<span className="text-xs font-mono text-on-secondary-container/60">#B600F8</span>
</div>
<div className="bg-surface-container-highest p-4 rounded-lg flex flex-col justify-end group transition-all hover:scale-[1.02]">
<span className="text-[10px] font-bold text-on-surface uppercase">Surface High</span>
<span className="text-xs font-mono text-on-surface/60">#35343A</span>
</div>
<div className="bg-surface-dim border border-outline-variant p-4 rounded-lg flex flex-col justify-end group transition-all hover:scale-[1.02]">
<span className="text-[10px] font-bold text-on-background uppercase">Base Void</span>
<span className="text-xs font-mono text-on-background/60">#131318</span>
</div>
</div>
<div className="mt-8 flex gap-4">
<div className="flex-1 h-2 bg-gradient-to-r from-primary to-secondary rounded-full opacity-30"></div>
</div>
</div>
{/*  Spacing & Layout  */}
<div className="md:col-span-12 bg-surface-container-low/60 backdrop-blur-md p-8 ghost-border rounded-xl flex flex-col md:flex-row gap-12 items-center">
<div className="md:w-1/3">
<h3 className="font-headline text-xl text-tertiary uppercase tracking-widest mb-4">Intentional Asymmetry</h3>
<p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                                We break the grid to create cinematic tension. Spacing is treated as a structural anchor rather than a simple container.
                            </p>
<div className="flex gap-4">
<div className="w-8 h-8 bg-primary/20 border border-primary/40 rounded flex items-center justify-center text-[10px] text-primary">8</div>
<div className="w-12 h-12 bg-primary/20 border border-primary/40 rounded flex items-center justify-center text-[10px] text-primary">16</div>
<div className="w-16 h-16 bg-primary/20 border border-primary/40 rounded flex items-center justify-center text-[10px] text-primary">32</div>
</div>
</div>
<div className="md:w-2/3 flex gap-2 items-end overflow-hidden h-40">
<div className="w-1/6 bg-surface-container-highest h-1/4 rounded-t-lg"></div>
<div className="w-1/6 bg-surface-container-highest h-3/4 rounded-t-lg"></div>
<div className="w-1/6 bg-primary h-full rounded-t-lg opacity-80"></div>
<div className="w-1/6 bg-surface-container-highest h-2/3 rounded-t-lg"></div>
<div className="w-1/6 bg-surface-container-highest h-1/2 rounded-t-lg"></div>
<div className="w-1/6 bg-secondary h-5/6 rounded-t-lg opacity-80"></div>
</div>
</div>
</div>
</section>
</main>
</div>
{/*  Footer  */}
<footer className="w-full py-12 border-t border-cyan-500/5 bg-slate-950">
<div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto">
<div className="mb-8 md:mb-0">
<span className="text-cyan-500 font-bold font-headline uppercase tracking-widest">Synthetic Noir</span>
<p className="text-slate-600 font-manrope text-xs tracking-widest uppercase mt-2">© 2024 Synthetic Noir Design System. Built for the Monolith.</p>
</div>
<div className="flex gap-8">
<a className="text-slate-600 hover:text-cyan-300 transition-colors underline underline-offset-4 font-manrope text-xs tracking-widest uppercase opacity-80 hover:opacity-100" href="#">Documentation</a>
<a className="text-slate-600 hover:text-cyan-300 transition-colors underline underline-offset-4 font-manrope text-xs tracking-widest uppercase opacity-80 hover:opacity-100" href="#">Privacy</a>
<a className="text-slate-600 hover:text-cyan-300 transition-colors underline underline-offset-4 font-manrope text-xs tracking-widest uppercase opacity-80 hover:opacity-100" href="#">Changelog</a>
</div>
</div>
</footer>

    </div>
  );
}

