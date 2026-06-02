import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import matplotlib.patches as mpatches
import streamlit as st
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# ── Page Config ───────────────────────────────────────────
st.set_page_config(
    page_title='Job Posting Indonesia Dashboard',
    page_icon='💼',
    layout='wide'
)

# ── Custom CSS ────────────────────────────────────────────
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .main {
        background-color: #F2F2F2;
    }

    /* Header */
    .dashboard-header {
        background: linear-gradient(
            135deg,
            #B30000 0%,
            #8B0000 100%
        );
        border-radius: 16px;
        padding: 32px 40px;
        margin-bottom: 24px;
        position: relative;
        overflow: hidden;
    }

    .dashboard-header::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -10%;
        width: 400px;
        height: 400px;
        background: radial-gradient(
            circle,
            rgba(255,255,255,0.15) 0%,
            transparent 70%
        );
        border-radius: 50%;
    }

    .dashboard-title {
        font-size: 2.4rem;
        font-weight: 800;
        color: white;
        margin: 0;
    }

    .dashboard-subtitle {
        color: rgba(255,255,255,0.85);
        font-size: 0.95rem;
        margin-top: 6px;
    }

    /* Sidebar */
    [data-testid="stSidebar"] {
        background: white;
        border-right: 1px solid #E0E0E0;
    }

    /* Metric */
    div[data-testid="metric-container"] {
        background: white;
        border: 1px solid #E0E0E0;
        border-radius: 12px;
        padding: 16px 20px;
    }

    div[data-testid="metric-container"] label {
        color: #808080 !important;
        font-size: 0.75rem !important;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    div[data-testid="metric-container"] [data-testid="stMetricValue"] {
        color: #B30000 !important;
        font-size: 1.8rem !important;
        font-weight: 800 !important;
    }

    /* Section Header */
    .section-header {
        background: linear-gradient(
            90deg,
            rgba(179,0,0,0.08),
            transparent
        );
        border-left: 4px solid #B30000;
        border-radius: 0 8px 8px 0;
        padding: 12px 20px;
        margin: 8px 0 16px 0;
    }

    .section-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #2E2E2E;
        margin: 0;
    }

    .section-desc {
        font-size: 0.8rem;
        color: #808080;
        margin: 2px 0 0 0;
    }

    /* Insight */
    .insight-box {
        background: #FFF5F5;
        border: 1px solid #D32F2F;
        border-radius: 10px;
        padding: 14px 18px;
        margin-top: 10px;
    }

    .insight-text {
        color: #8B0000;
        font-size: 0.85rem;
        margin: 0;
    }

    /* General */
    .stMetric {
        background: white;
        border-radius: 12px;
        border: 1px solid #E0E0E0;
    }
</style>
""", unsafe_allow_html=True)

# ── Workaholic Brand Palette ──────────────────────────────
RED        = '#B30000'
DARK_RED   = '#8B0000'
LIGHT_RED  = '#D32F2F'

BLACK      = '#000000'
DARK_GRAY  = '#2E2E2E'
GRAY       = '#808080'
LIGHT_GRAY = '#F2F2F2'

WHITE      = '#FFFFFF'

# Mapping ke variabel yang sudah dipakai dashboard
BLUE       = RED
ORANGE     = LIGHT_RED
PURPLE     = DARK_RED
GREEN      = DARK_GRAY
TEAL       = GRAY
YELLOW     = '#C62828'
PINK       = '#E57373'

BG_CHART   = '#FFFFFF'
TEXT_COLOR = '#2E2E2E'
GRID_COLOR = '#E0E0E0'

def style_ax(ax, title='', xlabel='', ylabel=''):
    ax.set_facecolor(BG_CHART)
    ax.figure.set_facecolor(BG_CHART)
    ax.tick_params(colors=TEXT_COLOR, labelsize=8)
    ax.spines['bottom'].set_color(GRID_COLOR)
    ax.spines['left'].set_color(GRID_COLOR)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.xaxis.label.set_color(TEXT_COLOR)
    ax.yaxis.label.set_color(TEXT_COLOR)
    ax.yaxis.set_tick_params(labelcolor=TEXT_COLOR)
    ax.xaxis.set_tick_params(labelcolor=TEXT_COLOR)
    if title:
        ax.set_title(title, color='#f1f5f9', fontsize=10, fontweight='bold', pad=10)
    if xlabel:
        ax.set_xlabel(xlabel, color=TEXT_COLOR, fontsize=8)
    if ylabel:
        ax.set_ylabel(ylabel, color=TEXT_COLOR, fontsize=8)
    ax.yaxis.grid(True, color=GRID_COLOR, linewidth=0.5, alpha=0.5)
    ax.set_axisbelow(True)

# ── Load Data ─────────────────────────────────────────────
@st.cache_data
def load_data():
    df = pd.read_csv('../data/loker_clean.csv', low_memory=False)

    df['main_category'] = df['categoriesName'].str.split(',').str[0].str.strip()
    df['main_location'] = df['locations'].str.split(',').str[0].str.strip()

    df['wilayah'] = df['main_location'].apply(lambda x:
        'Pulau Jawa'
        if x in [
            'Jakarta Raya','Jakarta Selatan','Jakarta Barat','Jakarta Utara',
            'Jakarta Pusat','Surabaya','Bandung','Tangerang','Yogyakarta',
            'Semarang','Bekasi','Depok','Bogor','Malang','Sidoarjo'
        ]
        else 'Luar Jawa'
    )

    df['employment'] = df['employment'].astype(str).str.strip()

    return df

df = load_data()

# ── Sidebar Filter ────────────────────────────────────────
st.sidebar.markdown("## 🔍 Filter Data")

wilayah_opt = ['Semua'] + sorted(df['wilayah'].unique().tolist())
wilayah_sel = st.sidebar.selectbox('🗺️ Wilayah', wilayah_opt)

emp_opt = ['Semua'] + sorted([e for e in df['employment'].unique().tolist() if str(e) != 'nan'])
emp_sel = st.sidebar.selectbox('👔 Tipe Pekerjaan', emp_opt)

cat_opt = ['Semua'] + sorted(df['main_category'].unique().tolist())
cat_sel = st.sidebar.selectbox('📂 Kategori Pekerjaan', cat_opt)

st.sidebar.markdown("---")
st.sidebar.markdown("<small style='color:#64748b'>Data: Jobstreet Indonesia 2021–2022</small>", unsafe_allow_html=True)

# Apply filter
df_filtered = df.copy()
if wilayah_sel != 'Semua':
    df_filtered = df_filtered[df_filtered['wilayah'] == wilayah_sel]
if emp_sel != 'Semua':
    df_filtered = df_filtered[df_filtered['employment'] == emp_sel]
if cat_sel != 'Semua':
    df_filtered = df_filtered[df_filtered['main_category'] == cat_sel]

# Salary filter
df_sal = df_filtered.dropna(subset=['salaryMin','salaryMax'])
df_sal = df_sal[(df_sal['salaryMin'] >= 2_000_000) & (df_sal['salaryMax'] <= 50_000_000)].copy()
df_sal['salary_mid'] = (df_sal['salaryMin'] + df_sal['salaryMax']) / 2

# ── Header ────────────────────────────────────────────────
st.markdown("""
<div class="dashboard-header">
    <p class="dashboard-title">💼 Dashboard Lowongan Kerja Indonesia</p>
    <p class="dashboard-subtitle">Analisis data lowongan kerja Jobstreet Indonesia tahun 2021–2022</p>
</div>
""", unsafe_allow_html=True)

# ── Metric Cards ──────────────────────────────────────────
c1, c2, c3, c4, c5 = st.columns(5)
avg_gaji = df_sal['salary_mid'].median() if len(df_sal) > 0 else 0

c1.metric('📋 Total Lowongan', f'{len(df_filtered):,}')
c2.metric('🏙️ Total Kota', f'{df_filtered["main_location"].nunique():,}')
c3.metric('📂 Total Kategori', f'{df_filtered["main_category"].nunique():,}')
c4.metric('💰 Median Gaji', f'Rp {avg_gaji/1e6:.1f}jt')
c5.metric('👔 Tipe Pekerjaan', f'{df_filtered["employment"].nunique():,}')

st.markdown("<br>", unsafe_allow_html=True)

# ══════════════════════════════════════════════════════════
# PB 1: Kategori Pekerjaan Terbanyak
# ══════════════════════════════════════════════════════════
st.markdown("""
<div class="section-header">
    <p class="section-title">📊 Pertanyaan 1 — Kategori pekerjaan apa yang paling banyak dibutuhkan?</p>
    <p class="section-desc">Top 10 kategori berdasarkan jumlah lowongan & konsistensi antar kota besar</p>
</div>
""", unsafe_allow_html=True)

col1, col2 = st.columns([3, 2])

with col1:
    top_cats = df_filtered['main_category'].value_counts().head(10)
    fig, ax = plt.subplots(figsize=(8, 4))
    style_ax(ax, title='Top 10 Kategori Pekerjaan', xlabel='Jumlah Lowongan')
    colors = [ORANGE if i == 0 else '#ea580c' if i < 3 else '#c2410c' for i in range(len(top_cats))]
    bars = ax.barh(top_cats.index[::-1], top_cats.values[::-1], color=colors[::-1], height=0.6)
    for i, v in enumerate(top_cats.values[::-1]):
        ax.text(v + 200, i, f'{v:,}', va='center', fontsize=8, color=TEXT_COLOR)
    ax.set_xlim(0, top_cats.values.max() * 1.15)
    plt.tight_layout()
    st.pyplot(fig)
    plt.close()

with col2:
    # Top kategori per kota besar
    kota_besar = ['Jakarta Raya', 'Surabaya', 'Bandung', 'Tangerang', 'Semarang']
    df_kota = df_filtered[df_filtered['main_location'].isin(kota_besar)]
    top1_per_kota = df_kota.groupby('main_location')['main_category'].agg(
        lambda x: x.value_counts().index[0] if len(x) > 0 else '-'
    ).reset_index()
    top1_per_kota.columns = ['Kota', 'Kategori #1']

    fig2, ax2 = plt.subplots(figsize=(5, 4))
    ax2.set_facecolor(BG_CHART)
    ax2.figure.set_facecolor(BG_CHART)
    ax2.axis('off')
    ax2.set_title('Kategori Teratas per Kota Besar', color='#f1f5f9', fontsize=10, fontweight='bold')

    table_data = [top1_per_kota.columns.tolist()] + top1_per_kota.values.tolist()
    table = ax2.table(
        cellText=top1_per_kota.values,
        colLabels=top1_per_kota.columns,
        cellLoc='center', loc='center',
        bbox=[0, 0, 1, 0.85]
    )

    fig2, ax2 = plt.subplots(figsize=(5,4))
    ax2.axis('off')

    table = ax2.table(
        cellText=top1_per_kota.values,
        colLabels=top1_per_kota.columns,
        cellLoc='center',
        loc='center'
    )

    table.auto_set_font_size(False)
    table.set_fontsize(9)
    table.scale(1.2, 2)

    for (row, col), cell in table.get_celld().items():

        if row == 0:
            cell.set_facecolor('#C00000')
            cell.set_text_props(
                color='white',
                weight='bold'
            )
        else:
            cell.set_facecolor('white')
            cell.set_text_props(
                color='black'
            )

        cell.set_edgecolor('#DDDDDD')

    st.pyplot(fig2)
    plt.close()

    st.markdown("""
    <div class="insight-box">
        <p class="insight-text">💡<b>Insight:</b> Penjualan/Pemasaran menjadi kategori pekerjaan yang paling banyak dibutuhkan, diikuti oleh Akuntansi/Keuangan dan IT/Komputer. Temuan ini menunjukkan bahwa selain transformasi digital, fungsi bisnis yang berhubungan langsung dengan pertumbuhan pendapatan perusahaan masih menjadi prioritas utama dalam rekrutmen.</p>
    </div>
    """, unsafe_allow_html=True)

st.divider()

# ══════════════════════════════════════════════════════════
# PB 2: Distribusi Lowongan per Kota
# ══════════════════════════════════════════════════════════
st.markdown("""
<div class="section-header">
    <p class="section-title">🗺️ Pertanyaan 2 — Kota mana yang paling banyak membuka lowongan?</p>
    <p class="section-desc">Distribusi lowongan per kota & perbandingan Pulau Jawa vs Luar Jawa</p>
</div>
""", unsafe_allow_html=True)

col1, col2 = st.columns([2, 1])

with col1:
    top_locs = df_filtered['main_location'].value_counts().head(10)
    fig, ax = plt.subplots(figsize=(8, 4))
    style_ax(ax, title='Top 10 Kota dengan Lowongan Terbanyak', xlabel='Jumlah Lowongan')
    grad_colors = [ORANGE if i == 0 else '#ea580c' if i < 3 else '#c2410c' for i in range(len(top_locs))]
    ax.barh(top_locs.index[::-1], top_locs.values[::-1], color=grad_colors[::-1], height=0.6)
    for i, v in enumerate(top_locs.values[::-1]):
        ax.text(v + 100, i, f'{v:,}', va='center', fontsize=8, color=TEXT_COLOR)
    ax.set_xlim(0, top_locs.values.max() * 1.15)
    plt.tight_layout()
    st.pyplot(fig)
    plt.close()

with col2:
    wilayah_count = df_filtered['wilayah'].value_counts()
    fig, ax = plt.subplots(figsize=(4, 4))
    ax.set_facecolor(BG_CHART)
    ax.figure.set_facecolor(BG_CHART)
    wedges, texts, autotexts = ax.pie(
        wilayah_count.values,
        labels=wilayah_count.index,
        autopct='%1.1f%%',
        colors=[BLUE, ORANGE],
        startangle=90,
        wedgeprops={'edgecolor': BG_CHART, 'linewidth': 3}
    )
    for t in texts: t.set_color(TEXT_COLOR)
    for at in autotexts: at.set_color('#ffffff'); at.set_fontweight('bold')
    ax.set_title('Jawa vs Luar Jawa', color='#f1f5f9', fontsize=10, fontweight='bold')
    plt.tight_layout()
    st.pyplot(fig)
    plt.close()

    st.markdown("""
    <div class="insight-box">
        <p class="insight-text">💡 <b>Insight:</b> Pulau Jawa — terutama Jakarta — mendominasi pasar kerja nasional, menunjukkan ketimpangan distribusi lowongan yang signifikan.</p>
    </div>
    """, unsafe_allow_html=True)

st.divider()

# ══════════════════════════════════════════════════════════
# PB 3: Gaji per Kategori
# ══════════════════════════════════════════════════════════
st.markdown("""
<div class="section-header">
    <p class="section-title">💰 Pertanyaan 3 — Bagaimana perbandingan gaji antar kategori pekerjaan?</p>
    <p class="section-desc">Median gaji dan gap antara gaji minimum-maksimum per kategori</p>
</div>
""", unsafe_allow_html=True)

if len(df_sal) == 0:
    st.warning('⚠️ Tidak ada data gaji yang tersedia untuk filter yang dipilih.')
else:
    col1, col2 = st.columns(2)
    df_sal['main_cat'] = df_sal['categoriesName'].str.split(',').str[0].str.strip()

    with col1:
        top_cat_sal = df_sal.groupby('main_cat')['salary_mid'].median() \
            .sort_values(ascending=False).head(8)
        fig, ax = plt.subplots(figsize=(6, 4))
        style_ax(ax, title='Median Gaji per Kategori (Top 8)')
        bars = ax.barh(top_cat_sal.index[::-1], top_cat_sal.values[::-1], color=PURPLE, height=0.6)
        ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x,_: f'Rp {x/1e6:.0f}jt'))
        for i, v in enumerate(top_cat_sal.values[::-1]):
            ax.text(v + 50000, i, f'Rp {v/1e6:.1f}jt', va='center', fontsize=8, color=TEXT_COLOR)
        ax.set_xlim(0, top_cat_sal.values.max() * 1.2)
        plt.tight_layout()
        st.pyplot(fig)
        plt.close()

    with col2:
        gap = df_sal.groupby('main_cat').agg(
            avg_min=('salaryMin','median'), avg_max=('salaryMax','median')
        ).sort_values('avg_max', ascending=False).head(8)
        fig, ax = plt.subplots(figsize=(6, 4))
        style_ax(ax, title='Gap Gaji Min vs Max per Kategori')
        ax.barh(gap.index[::-1], gap['avg_max'][::-1], color=RED, alpha=0.85, label='Gaji Max', height=0.6)
        ax.barh(gap.index[::-1], gap['avg_min'][::-1], color=GREEN, alpha=0.95, label='Gaji Min', height=0.6)
        ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x,_: f'Rp {x/1e6:.0f}jt'))
        legend = ax.legend(facecolor='#f1f5f9', edgecolor=GRID_COLOR, labelcolor=TEXT_COLOR, fontsize=8)
        plt.tight_layout()
        st.pyplot(fig)
        plt.close()

    st.markdown("""
    <div class="insight-box">
        <p class="insight-text">💡 <b>Insight:</b> Sektor IT & Teknologi menawarkan gaji tertinggi dengan gap min-max terbesar, mencerminkan variasi tingkat senioritas yang luas di industri ini.</p>
    </div>
    """, unsafe_allow_html=True)

st.divider()

# ══════════════════════════════════════════════════════════
# PB 4: Tipe Pekerjaan vs Gaji
# ══════════════════════════════════════════════════════════
st.markdown("""
<div class="section-header">
    <p class="section-title">👔 Pertanyaan 4 — Apakah tipe pekerjaan mempengaruhi kisaran gaji?</p>
    <p class="section-desc">Perbandingan median gaji berdasarkan tipe pekerjaan (Full-time, Contract, dll)</p>
</div>
""", unsafe_allow_html=True)

# Get actual employment values from data
valid_emp = [e for e in df['employment'].unique() if str(e) not in ['nan', 'unknown', 'Unknown']]

if len(df_sal) == 0:
    st.warning('⚠️ Tidak ada data gaji yang tersedia untuk filter yang dipilih.')
else:
    emp_sal = df_sal[df_sal['employment'].isin(valid_emp)].groupby('employment')['salary_mid'].median()
    emp_sal = emp_sal.sort_values(ascending=False)

    col1, col2 = st.columns(2)

    with col1:
        if len(emp_sal) > 0:
            fig, ax = plt.subplots(figsize=(6, 4))
            style_ax(ax, title='Median Gaji per Tipe Pekerjaan', xlabel='Tipe Pekerjaan')
            bar_colors = [TEAL, BLUE, PURPLE, ORANGE, GREEN][:len(emp_sal)]
            bars = ax.bar(emp_sal.index, emp_sal.values, color=bar_colors, width=0.5)
            ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x,_: f'Rp {x/1e6:.1f}jt'))
            for i, (label, v) in enumerate(zip(emp_sal.index, emp_sal.values)):
                ax.text(i, v + 100000, f'Rp {v/1e6:.1f}jt', ha='center', fontsize=8, color=TEXT_COLOR)
            ax.set_ylim(0, emp_sal.values.max() * 1.25)
            plt.xticks(rotation=15, ha='right')
            plt.tight_layout()
            st.pyplot(fig)
            plt.close()
        else:
            st.info('Data gaji per tipe pekerjaan tidak tersedia.')

    with col2:
        # Box-plot style: gaji min-max per tipe pekerjaan
        emp_range = df_sal[df_sal['employment'].isin(valid_emp)].groupby('employment').agg(
            gaji_min=('salaryMin', 'median'),
            gaji_max=('salaryMax', 'median')
        ).sort_values('gaji_max', ascending=False)

        if len(emp_range) > 0:
            fig, ax = plt.subplots(figsize=(6, 4))
            style_ax(ax, title='Kisaran Gaji per Tipe Pekerjaan')
            x = range(len(emp_range))
            ax.bar(x, emp_range['gaji_max'], color=RED, alpha=0.8, label='Gaji Max', width=0.4)
            ax.bar(x, emp_range['gaji_min'], color=GREEN, alpha=0.9, label='Gaji Min', width=0.4)
            ax.set_xticks(list(x))
            ax.set_xticklabels(emp_range.index, rotation=15, ha='right', fontsize=8)
            ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x,_: f'Rp {x/1e6:.0f}jt'))
            legend = ax.legend(facecolor='#f1f5f9', edgecolor=GRID_COLOR, labelcolor=TEXT_COLOR, fontsize=8)
            plt.tight_layout()
            st.pyplot(fig)
            plt.close()

    st.markdown("""
    <div class="insight-box">
        <p class="insight-text">💡 <b>Insight:</b> Full-time cenderung menawarkan gaji lebih tinggi dibanding Contract dan Part-time, sementara Internship memiliki kisaran gaji paling rendah.</p>
    </div>
    """, unsafe_allow_html=True)

st.divider()

# ══════════════════════════════════════════════════════════
# PB 5: Distribusi Tipe Pekerjaan
# ══════════════════════════════════════════════════════════
st.markdown("""
<div class="section-header">
    <p class="section-title">📈 Pertanyaan 5 — Bagaimana distribusi tipe pekerjaan & perbedaannya antar kota?</p>
    <p class="section-desc">Proporsi tipe pekerjaan secara keseluruhan dan per kota besar</p>
</div>
""", unsafe_allow_html=True)

col1, col2 = st.columns(2)

with col1:
    emp_dist = df_filtered[
        df_filtered['employment'].isin(valid_emp)
    ]['employment'].value_counts()

    if len(emp_dist) > 0:

        # Ambil 5 kategori terbesar saja
        emp_dist = emp_dist.head(5)

        fig, ax = plt.subplots(figsize=(5, 4))
        ax.set_facecolor(BG_CHART)
        ax.figure.set_facecolor(BG_CHART)

        pie_colors = [BLUE, ORANGE, PURPLE, GREEN, TEAL][:len(emp_dist)]

        wedges, texts, autotexts = ax.pie(
            emp_dist.values,
            labels=None,
            autopct=lambda p: f'{p:.1f}%' if p >= 3 else '',
            colors=pie_colors,
            startangle=90,
            wedgeprops={
                'edgecolor': BG_CHART,
                'linewidth': 2
            }
        )

        for at in autotexts:
            at.set_color('white')
            at.set_fontweight('bold')
            at.set_fontsize(8)

        ax.legend(
            wedges,
            emp_dist.index,
            loc='lower center',
            bbox_to_anchor=(0.5, -0.25),
            ncol=2,
            frameon=False,
            fontsize=8
        )

        ax.set_title(
            'Distribusi Tipe Pekerjaan (Keseluruhan)',
            color=TEXT_COLOR,
            fontsize=10,
            fontweight='bold'
        )

        plt.tight_layout()
        st.pyplot(fig)
        plt.close()

with col2:

    kota_besar = [
        'Jakarta Raya',
        'Surabaya',
        'Bandung',
        'Tangerang',
        'Semarang'
    ]

    df_kota_emp = df_filtered[
        (df_filtered['main_location'].isin(kota_besar))
        &
        (df_filtered['employment'].isin(valid_emp))
    ]

    if len(df_kota_emp) > 0:

        pivot = df_kota_emp.groupby(
            ['main_location', 'employment']
        ).size().unstack(fill_value=0)

        pivot_pct = pivot.div(
            pivot.sum(axis=1),
            axis=0
        ) * 100

        if 'Contract' in pivot_pct.columns:

            contract_pct = pivot_pct['Contract'].sort_values(
                ascending=False
            )

            fig, ax = plt.subplots(figsize=(6, 4))

            style_ax(
                ax,
                title='Persentase Lowongan Contract per Kota'
            )

            bars = ax.bar(
                contract_pct.index,
                contract_pct.values,
                color=RED,
                width=0.6
            )

            for bar in bars:
                height = bar.get_height()
                ax.text(
                    bar.get_x() + bar.get_width()/2,
                    height + 0.3,
                    f'{height:.1f}%',
                    ha='center',
                    fontsize=8,
                    color=TEXT_COLOR
                )

            ax.set_ylabel(
                'Persentase (%)',
                color=TEXT_COLOR
            )

            plt.xticks(
                rotation=15,
                ha='right'
            )

            plt.tight_layout()
            st.pyplot(fig)
            plt.close()

        else:
            st.info('Tidak ada data Contract.')

    else:
        st.info('Data tidak cukup untuk analisis per kota.')

st.markdown("""
<div class="insight-box">
    <p class="insight-text">
        💡 <b>Insight:</b> Full-time tetap mendominasi pasar kerja, namun proporsi lowongan Contract berbeda di setiap kota, menunjukkan kebutuhan tenaga kerja yang lebih fleksibel pada wilayah tertentu.
    </p>
</div>
""", unsafe_allow_html=True)

st.divider()

# ── Footer ────────────────────────────────────────────────
st.markdown("""
<div style="text-align:center; padding: 20px; color: #475569; font-size: 0.8rem;">
    © 2024 Job Posting Indonesia Dashboard &nbsp;|&nbsp; Data: Jobstreet Indonesia 2021–2022 &nbsp;|&nbsp; Dibuat dengan Streamlit 🚀
</div>
""", unsafe_allow_html=True)
