import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import warnings
warnings.filterwarnings('ignore')

# ─── Page Config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="E-Commerce Analytics Dashboard",
    page_icon="🛒",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown("""
<style>
    .metric-card {
        background: linear-gradient(135deg, #1565C0, #1E88E5);
        padding: 1.2rem 1.5rem;
        border-radius: 12px;
        color: white;
        text-align: center;
        margin-bottom: 0.5rem;
    }
    .metric-card h2 { margin: 0; font-size: 1.9rem; }
    .metric-card p  { margin: 0; font-size: 0.82rem; opacity: 0.85; }
    .section-title {
        font-size: 1.3rem;
        font-weight: 700;
        color: #1565C0;
        border-left: 5px solid #1E88E5;
        padding-left: 12px;
        margin: 1.5rem 0 1rem 0;
    }
    .insight-box {
        background: #E3F2FD;
        border-left: 4px solid #1E88E5;
        padding: 0.8rem 1rem;
        border-radius: 0 8px 8px 0;
        margin-top: 1rem;
        font-size: 0.88rem;
    }
</style>
""", unsafe_allow_html=True)

# ─── Load Data ─────────────────────────────────────────────────────────────────
@st.cache_data
def load_data():
    df = pd.read_csv("dashboard/main_data.csv")
    df['order_purchase_timestamp']       = pd.to_datetime(df['order_purchase_timestamp'])
    df['order_delivered_customer_date']  = pd.to_datetime(df['order_delivered_customer_date'])
    df['order_estimated_delivery_date']  = pd.to_datetime(df['order_estimated_delivery_date'])
    return df

df = load_data()

# ─── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.image("https://cdn-icons-png.flaticon.com/512/3081/3081559.png", width=70)
    st.title("🛒 E-Commerce\nAnalytics")
    st.markdown("---")
    st.markdown("### 🔍 Filter Data")

    years = sorted(df['purchase_year'].dropna().unique().astype(int))
    sel_years = st.multiselect("Tahun", years, default=years)

    states = sorted(df['customer_state'].dropna().unique())
    sel_states = st.multiselect("Negara Bagian", states, default=states)

    top_cats = (df.groupby('product_category_name_english')['price']
                .sum().sort_values(ascending=False).head(20).index.tolist())
    sel_cats = st.multiselect("Kategori Produk (Top 20)", top_cats, default=top_cats)

    st.markdown("---")
    st.caption("📊 Brazilian E-Commerce Public Dataset\nOlist — 2016–2018")

# ─── Filter ────────────────────────────────────────────────────────────────────
filtered = df[
    (df['purchase_year'].isin(sel_years)) &
    (df['customer_state'].isin(sel_states) if sel_states else True) &
    (df['product_category_name_english'].isin(sel_cats) if sel_cats else True)
]

# ─── Header ────────────────────────────────────────────────────────────────────
st.title("🛒 E-Commerce Public Dataset — Analytics Dashboard")
st.markdown("Analisis komprehensif data pesanan e-commerce Brasil (2016–2018): revenue, pengiriman, kepuasan pelanggan, RFM, dan geospatial.")
st.markdown("---")

# ─── KPI Cards ─────────────────────────────────────────────────────────────────
k1, k2, k3, k4, k5 = st.columns(5)
metrics = [
    (f"R${filtered['payment_value'].sum()/1e6:.1f}M", "Total Revenue"),
    (f"{filtered['order_id'].nunique():,}",            "Total Pesanan"),
    (f"{filtered['review_score'].mean():.2f} ⭐",      "Avg Review Score"),
    (f"{filtered['is_late'].mean()*100:.1f}%",         "Tingkat Keterlambatan"),
    (f"R${filtered['payment_value'].mean():.0f}",      "Avg Order Value"),
]
for col, (val, label) in zip([k1,k2,k3,k4,k5], metrics):
    with col:
        st.markdown(f'<div class="metric-card"><h2>{val}</h2><p>{label}</p></div>', unsafe_allow_html=True)

st.markdown("---")

# ─── Tabs ──────────────────────────────────────────────────────────────────────
tab1, tab2, tab3, tab4 = st.tabs(["📦 Revenue & Produk", "🚚 Pengiriman & Review", "👥 RFM Segmentasi", "🗺️ Geospatial"])

# ══════════════════════════════════════════════════════════════════════
# TAB 1 — Revenue & Products
# ══════════════════════════════════════════════════════════════════════
with tab1:
    st.markdown('<div class="section-title">Pertanyaan 1: Kategori Produk & Tren Revenue</div>', unsafe_allow_html=True)

    c1, c2 = st.columns(2)

    with c1:
        n = st.slider("Tampilkan Top N Kategori", 5, 20, 10, key="n_cats")
        rev_cat = (filtered.groupby('product_category_name_english')
                   .agg(Revenue=('price','sum'), Orders=('order_id','nunique'))
                   .sort_values('Revenue', ascending=False).head(n).reset_index())

        fig, ax = plt.subplots(figsize=(7, n * 0.42 + 1.2))
        cols_bar = ['#1565C0' if i == 0 else '#90CAF9' for i in range(n)]
        bars = ax.barh(rev_cat['product_category_name_english'][::-1],
                       rev_cat['Revenue'][::-1] / 1e6, color=cols_bar[::-1], edgecolor='white')
        for bar, val in zip(bars, rev_cat['Revenue'][::-1] / 1e6):
            ax.text(val + 0.02, bar.get_y() + bar.get_height()/2,
                    f'R${val:.2f}M', va='center', fontsize=8)
        ax.set_xlabel('Revenue (Juta R$)')
        ax.set_title(f'Top {n} Kategori Berdasarkan Revenue', fontweight='bold')
        ax.set_xlim(0, rev_cat['Revenue'].max()/1e6 * 1.25)
        ax.grid(axis='x', alpha=0.4)
        plt.tight_layout()
        st.pyplot(fig); plt.close()

    with c2:
        metric_opt = st.radio("Metrik Tren:", ["Revenue", "Jumlah Pesanan"], horizontal=True)
        monthly = (filtered.groupby('purchase_year_month')
                   .agg(Revenue=('price','sum'), Orders=('order_id','nunique'))
                   .reset_index().sort_values('purchase_year_month'))
        monthly = monthly[monthly['purchase_year_month'] >= '2017-01']

        y_col = 'Revenue' if metric_opt == 'Revenue' else 'Orders'
        y_vals = monthly[y_col] / 1e6 if y_col == 'Revenue' else monthly[y_col]

        fig, ax = plt.subplots(figsize=(7, 5))
        ax.fill_between(range(len(monthly)), y_vals, alpha=0.25, color='#1E88E5')
        ax.plot(range(len(monthly)), y_vals, marker='o', color='#0D47A1', lw=2.5, ms=5)
        ax.set_xticks(range(len(monthly)))
        ax.set_xticklabels(monthly['purchase_year_month'], rotation=45, ha='right', fontsize=8)
        ax.set_ylabel(f'{y_col} (Juta R$)' if y_col == 'Revenue' else 'Jumlah Pesanan')
        ax.set_title(f'Tren {metric_opt} Bulanan', fontweight='bold')
        if y_col == 'Revenue':
            ax.yaxis.set_major_formatter(mticker.FormatStrFormatter('R$%.1fM'))

        # Annotate peak
        pk = y_vals.idxmax()
        pk_x = list(monthly.index).index(pk)
        ax.annotate(f'Peak\n{monthly.loc[pk,"purchase_year_month"]}',
                    xy=(pk_x, y_vals[pk]),
                    xytext=(pk_x - 2, y_vals[pk] * 0.85),
                    arrowprops=dict(arrowstyle='->', color='red'),
                    fontsize=8, color='red', fontweight='bold')
        ax.grid(alpha=0.4)
        plt.tight_layout()
        st.pyplot(fig); plt.close()

    st.markdown("""<div class="insight-box">
    💡 <b>Insight:</b> <b>bed_bath_table</b>, <b>health_beauty</b>, dan <b>sports_leisure</b> adalah tiga kategori
    dengan revenue tertinggi. Puncak tren terjadi di <b>November 2017</b>, kemungkinan dipicu oleh Black Friday Brazil.
    </div>""", unsafe_allow_html=True)

# ══════════════════════════════════════════════════════════════════════
# TAB 2 — Delivery & Reviews
# ══════════════════════════════════════════════════════════════════════
with tab2:
    st.markdown('<div class="section-title">Pertanyaan 2: Ketepatan Pengiriman & Kepuasan Pelanggan</div>', unsafe_allow_html=True)

    dlv = filtered.dropna(subset=['delivery_delay_days','review_score']).copy()
    ontime_avg = dlv[~dlv['is_late']]['review_score'].mean()
    late_avg   = dlv[dlv['is_late']]['review_score'].mean()

    m1, m2, m3 = st.columns(3)
    m1.metric("Avg Score — Tepat Waktu", f"⭐ {ontime_avg:.2f}")
    m2.metric("Avg Score — Terlambat",   f"⭐ {late_avg:.2f}", delta=f"{late_avg - ontime_avg:.2f}")
    m3.metric("% Pesanan Tepat Waktu",   f"{(~dlv['is_late']).mean()*100:.1f}%")

    c1, c2 = st.columns(2)

    with c1:
        bins   = [-200,-14,-7,-1,0,7,14,100]
        labels_d = ['<-14d','-14~-7d','-7~-1d','0d','1~7d','8~14d','>14d']
        dlv['delay_cat'] = pd.cut(dlv['delivery_delay_days'], bins=bins, labels=labels_d)
        avg_delay = dlv.groupby('delay_cat', observed=True)['review_score'].mean()

        fig, ax = plt.subplots(figsize=(7, 4.5))
        bar_colors = ['#388E3C','#66BB6A','#A5D6A7','#FFF176','#FFB74D','#EF6C00','#B71C1C']
        bars = ax.bar(avg_delay.index, avg_delay.values, color=bar_colors, edgecolor='white', width=0.65)
        ax.axhline(3, color='gray', linestyle='--', lw=1.5, alpha=0.7, label='Skor Netral (3.0)')
        ax.set_ylim(1, 5.3)
        ax.set_ylabel('Rata-rata Skor Ulasan')
        ax.set_title('Review Score vs Kategori Keterlambatan', fontweight='bold')
        ax.legend(fontsize=9)
        ax.grid(axis='y', alpha=0.4)
        for bar, val in zip(bars, avg_delay.values):
            ax.text(bar.get_x()+bar.get_width()/2, val+0.08,
                    f'{val:.2f}', ha='center', fontsize=9, fontweight='bold')
        plt.tight_layout()
        st.pyplot(fig); plt.close()

    with c2:
        late_state = (filtered.dropna(subset=['delivery_delay_days'])
                      .groupby('customer_state')
                      .agg(total=('order_id','nunique'), late=('is_late','sum'),
                           avg_rev=('review_score','mean'))
                      .assign(late_rate=lambda x: x['late']/x['total']*100)
                      .sort_values('late_rate', ascending=False)
                      .head(15).reset_index())

        fig, ax = plt.subplots(figsize=(7, 5))
        bcs = ['#C62828' if r > 15 else '#EF9A9A' for r in late_state['late_rate']]
        ax.barh(late_state['customer_state'][::-1], late_state['late_rate'][::-1],
                color=bcs[::-1], edgecolor='white')
        ax.axvline(late_state['late_rate'].mean(), color='navy', linestyle='--',
                   label=f'Rata-rata: {late_state["late_rate"].mean():.1f}%')
        ax.set_xlabel('Tingkat Keterlambatan (%)')
        ax.set_title('Tingkat Keterlambatan per Negara Bagian\n(Top 15)', fontweight='bold')
        ax.legend(fontsize=9)
        ax.grid(axis='x', alpha=0.4)
        plt.tight_layout()
        st.pyplot(fig); plt.close()

    st.markdown("""<div class="insight-box">
    💡 <b>Insight:</b> Korelasi negatif kuat antara keterlambatan dan review score. Pesanan terlambat >14 hari
    mendapat rata-rata <b>~1.8 ⭐</b> vs <b>~4.4 ⭐</b> untuk yang tepat waktu.
    Negara bagian utara (AP, RR, AM) memiliki tingkat keterlambatan tertinggi.
    </div>""", unsafe_allow_html=True)

# ══════════════════════════════════════════════════════════════════════
# TAB 3 — RFM
# ══════════════════════════════════════════════════════════════════════
with tab3:
    st.markdown('<div class="section-title">Analisis Lanjutan: Segmentasi Pelanggan RFM</div>', unsafe_allow_html=True)

    SEG_COLORS = {
        'Champions':'#1B5E20','Loyal Customers':'#388E3C','New Customers':'#29B6F6',
        'Potential Loyalists':'#81C784','At Risk':'#FFA000',
        'Lost Customers':'#C62828','Hibernating':'#B0BEC5'
    }

    rfm_unique = filtered.drop_duplicates('customer_unique_id')[
        ['customer_unique_id','Recency','Frequency','Monetary','Segment']
    ].dropna(subset=['Segment'])

    seg_sum = (rfm_unique.groupby('Segment')
               .agg(Count=('customer_unique_id','count'),
                    Avg_Recency=('Recency','mean'),
                    Avg_Frequency=('Frequency','mean'),
                    Avg_Monetary=('Monetary','mean'))
               .sort_values('Count', ascending=False).reset_index())

    c1, c2 = st.columns(2)

    with c1:
        fig, ax = plt.subplots(figsize=(6, 6))
        wedges, texts, autotexts = ax.pie(
            seg_sum['Count'],
            labels=seg_sum['Segment'],
            colors=[SEG_COLORS[s] for s in seg_sum['Segment']],
            autopct='%1.1f%%', startangle=140,
            wedgeprops=dict(width=0.6),
            textprops={'fontsize': 8.5}
        )
        ax.set_title('Distribusi Segmen Pelanggan (RFM)', fontweight='bold')
        plt.tight_layout()
        st.pyplot(fig); plt.close()

    with c2:
        srt = seg_sum.sort_values('Avg_Monetary')
        fig, ax = plt.subplots(figsize=(6, 5))
        bars = ax.barh(srt['Segment'], srt['Avg_Monetary'],
                       color=[SEG_COLORS[s] for s in srt['Segment']], edgecolor='white')
        for bar, val in zip(bars, srt['Avg_Monetary']):
            ax.text(val+5, bar.get_y()+bar.get_height()/2,
                    f'R${val:.0f}', va='center', fontsize=9)
        ax.set_xlabel('Rata-rata Monetary Value (R$)')
        ax.set_title('Rata-rata Monetary per Segmen', fontweight='bold')
        ax.grid(axis='x', alpha=0.4)
        plt.tight_layout()
        st.pyplot(fig); plt.close()

    # Scatter R vs M
    fig, ax = plt.subplots(figsize=(10, 4))
    sample_rfm = rfm_unique.sample(min(5000, len(rfm_unique)), random_state=42)
    for seg, grp in sample_rfm.groupby('Segment'):
        ax.scatter(grp['Recency'], grp['Monetary'], c=SEG_COLORS[seg],
                   label=seg, alpha=0.35, s=8, edgecolors='none')
    ax.set_yscale('log')
    ax.set_xlabel('Recency (hari sejak terakhir beli)')
    ax.set_ylabel('Monetary (R$, log scale)')
    ax.set_title('Scatter Plot: Recency vs Monetary per Segmen', fontweight='bold')
    ax.legend(fontsize=8, markerscale=3, ncol=2)
    ax.grid(alpha=0.3)
    plt.tight_layout()
    st.pyplot(fig); plt.close()

    st.markdown("#### 📋 Ringkasan Segmen")
    disp = seg_sum.copy()
    disp.columns = ['Segmen','Jumlah Pelanggan','Avg Recency (hari)','Avg Frekuensi','Avg Monetary (R$)']
    disp['Avg Monetary (R$)'] = disp['Avg Monetary (R$)'].map('R${:,.0f}'.format)
    disp['Avg Recency (hari)'] = disp['Avg Recency (hari)'].map('{:.0f}'.format)
    disp['Avg Frekuensi'] = disp['Avg Frekuensi'].map('{:.2f}'.format)
    st.dataframe(disp, use_container_width=True)

    st.markdown("""<div class="insight-box">
    💡 <b>Insight:</b> <b>Loyal Customers</b> adalah segmen terbesar.
    <b>Hibernating</b> (~20%) merupakan pelanggan satu kali beli — peluang besar re-engagement.
    <b>Champions</b> memiliki monetary value tertinggi dan wajib diprioritaskan dalam program loyalitas.
    </div>""", unsafe_allow_html=True)

# ══════════════════════════════════════════════════════════════════════
# TAB 4 — Geospatial
# ══════════════════════════════════════════════════════════════════════
with tab4:
    st.markdown('<div class="section-title">Analisis Lanjutan: Distribusi Geografis Pelanggan</div>', unsafe_allow_html=True)

    SEG_COLORS = {
        'Champions':'#1B5E20','Loyal Customers':'#388E3C','New Customers':'#29B6F6',
        'Potential Loyalists':'#81C784','At Risk':'#FFA000',
        'Lost Customers':'#C62828','Hibernating':'#B0BEC5'
    }

    c1, c2 = st.columns(2)

    with c1:
        rev_state = (filtered.groupby('customer_state')
                     .agg(Revenue=('payment_value','sum'), Orders=('order_id','nunique'))
                     .sort_values('Revenue', ascending=False).head(15).reset_index())

        fig, ax = plt.subplots(figsize=(7, 5))
        cmap = plt.cm.Blues
        nv = (rev_state['Revenue'] - rev_state['Revenue'].min()) / \
             (rev_state['Revenue'].max() - rev_state['Revenue'].min())
        ax.bar(rev_state['customer_state'], rev_state['Revenue']/1e6,
               color=[cmap(0.3 + 0.7*v) for v in nv], edgecolor='white')
        ax.set_xlabel('Negara Bagian')
        ax.set_ylabel('Revenue (Juta R$)')
        ax.set_title('Revenue per Negara Bagian (Top 15)', fontweight='bold')
        ax.yaxis.set_major_formatter(mticker.FormatStrFormatter('R$%.1fM'))
        ax.tick_params(axis='x', rotation=45)
        ax.grid(axis='y', alpha=0.4)
        plt.tight_layout()
        st.pyplot(fig); plt.close()

    with c2:
        seg_state = (filtered.drop_duplicates('customer_unique_id')
                     .groupby(['customer_state','Segment'])['customer_unique_id'].count()
                     .reset_index().rename(columns={'customer_unique_id':'count'}))
        top10 = (seg_state.groupby('customer_state')['count'].sum()
                 .sort_values(ascending=False).head(10).index)
        pivot = (seg_state[seg_state['customer_state'].isin(top10)]
                 .pivot_table(index='customer_state', columns='Segment', values='count', fill_value=0))

        fig, ax = plt.subplots(figsize=(7, 5))
        pivot.plot(kind='bar', stacked=True, ax=ax,
                   color=[SEG_COLORS.get(c,'gray') for c in pivot.columns])
        ax.set_xlabel('Negara Bagian')
        ax.set_ylabel('Jumlah Pelanggan')
        ax.set_title('Komposisi Segmen RFM per Negara Bagian', fontweight='bold')
        ax.tick_params(axis='x', rotation=45)
        ax.legend(fontsize=7, loc='upper right')
        ax.grid(axis='y', alpha=0.4)
        plt.tight_layout()
        st.pyplot(fig); plt.close()

    # Scatter map
    st.markdown("#### 🗺️ Peta Sebaran Pelanggan di Brasil")
    sel_seg = st.multiselect(
        "Filter Segmen:", list(SEG_COLORS.keys()), default=list(SEG_COLORS.keys()), key="geo_seg"
    )
    geo_data = filtered.dropna(subset=['lat','lng']).drop_duplicates('customer_unique_id')
    geo_data = geo_data[
        (geo_data['lat'].between(-35, 5)) &
        (geo_data['lng'].between(-75, -30)) &
        (geo_data['Segment'].isin(sel_seg))
    ].sample(min(8000, len(geo_data)), random_state=42)

    fig, ax = plt.subplots(figsize=(11, 7))
    for seg, grp in geo_data.groupby('Segment'):
        ax.scatter(grp['lng'], grp['lat'], c=SEG_COLORS.get(seg,'gray'),
                   s=2.5, alpha=0.4, label=seg, edgecolors='none')
    ax.set_xlim(-75, -30); ax.set_ylim(-35, 5)
    ax.set_xlabel('Longitude'); ax.set_ylabel('Latitude')
    ax.set_title('Sebaran Geografis Pelanggan Berdasarkan Segmen RFM', fontweight='bold', fontsize=13)
    ax.legend(fontsize=9, markerscale=5, loc='lower left', fancybox=True, framealpha=0.85)
    ax.set_facecolor('#E3F2FD')
    ax.grid(alpha=0.3)
    plt.tight_layout()
    st.pyplot(fig); plt.close()

    st.markdown("""<div class="insight-box">
    💡 <b>Insight:</b> <b>São Paulo (SP)</b> mendominasi revenue, menyumbang >40% total nasional.
    Pelanggan terkonsentrasi di pesisir tenggara Brasil mengikuti pola populasi.
    Wilayah utara dan barat daya memiliki kepadatan rendah — potensi ekspansi pasar besar.
    </div>""", unsafe_allow_html=True)

# ─── Footer ────────────────────────────────────────────────────────────────────
st.markdown("---")
st.markdown(
    "<div style='text-align:center;color:#888;font-size:0.82rem;'>"
    "📊 E-Commerce Analytics Dashboard | Brazilian E-Commerce Public Dataset by Olist | 2016–2018"
    "</div>", unsafe_allow_html=True
)
