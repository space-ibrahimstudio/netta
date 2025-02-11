import React, { Fragment, forwardRef } from "react";
import { useContent, useFormat } from "@ibrahimstudio/react";
import { useAuth } from "../../libs/securities/auth";
import { useAlias } from "../../libs/plugins/helper";
import styles from "./styles/invoice.module.css";

const InvoiceContent = ({ data, items }) => {
  const { toTitleCase } = useContent();
  const { newDate, newPrice } = useFormat();
  const { invoiceAlias } = useAlias();

  return (
    <Fragment>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <img className={styles.headerLogoIcon} loading="lazy" src="/svg/logo-primary.svg" />
          <span className={styles.headerOutlet}>{toTitleCase(data.outlet_name)}</span>
          <span className={styles.headerOutlet}>+62 8128 8364 747</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.headerInvoiceno}>{`INVOICE #${data.noinvoice}`}</span>
          <span className={styles.headerOutlet}>Billed to</span>
          <span className={styles.headerName}>{`${toTitleCase(data.transactionname)}`}</span>
          <span className={styles.headerOutlet}>{`${toTitleCase(data.transactionphone)}`}</span>
          <span className={styles.headerOutlet}>{data.transactionupdate !== "0000-00-00 00:00:00" ? `${newDate(data.transactionupdate, "id")}` : `${newDate(data.transactioncreate, "id")}`}</span>
        </div>
      </header>
      <section className={styles.header}>
        <div className={styles.subHeaderLeft}>
          <span className={styles.headerOutlet}>Informasi Dokter</span>
          <span className={styles.headerName}>{data.dentist === "" ? "Not set" : `${toTitleCase(data.dentist)}`}</span>
          <span className={styles.headerOutlet}>{`Nomor SIP : ${data.sip ? data.sip : "-"}`}</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.headerOutlet}>Informasi Terkait</span>
          {/* <span className={styles.headerOutlet}>{`Diterbitkan oleh ${toTitleCase(username)}`}</span> */}
          <span className={styles.headerOutlet}>{`Nomor Referensi : ${data.rscode}`}</span>
        </div>
      </section>
      <section className={styles.content}>
        <div className={styles.contentHead}>
          <div className={styles.headTh1}>
            <span className={styles.th1Marker}>#</span>
            <div className={styles.th1Textwrap}>
              <span className={styles.th1Text}>Nama Layanan</span>
            </div>
          </div>
          <div className={styles.summaryLabel}>
            <div className={styles.th1Textwrap}>
              <span className={styles.th1Text}>Jenis Layanan</span>
            </div>
          </div>
          <div className={styles.summaryValue}>
            <div className={styles.th1Textwrap}>
              <span className={styles.th1Text}>Harga Layanan</span>
            </div>
          </div>
        </div>
        <div className={styles.contentBody}>
          {items.map((item, index) => (
            <div key={index} className={styles.bodyTr}>
              <div className={styles.headTh1}>
                <span className={styles.th1Marker}>{index + 1}</span>
                <div className={styles.th1Textwrap}>
                  <span className={styles.th1Text}>{toTitleCase(item.service)}</span>
                </div>
              </div>
              <div className={styles.bodyTd2}>
                <div className={styles.th1Textwrap}>
                  <span className={styles.headerOutlet}>{toTitleCase(item.servicetype)}</span>
                </div>
              </div>
              <div className={styles.summaryValue}>
                <div className={styles.th1Textwrap}>
                  <span className={styles.th1Text}>{newPrice(item.price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.contentSummary}>
          <div className={styles.summaryLabel}>
            <div className={styles.labelWrap}>
              <span className={styles.th1Text}>Sub Total</span>
              <span className={styles.th1Text}>Kode Voucher</span>
            </div>
          </div>
          <div className={styles.summaryValue}>
            <div className={styles.labelWrap}>
              <span className={styles.th1Text}>{newPrice(data.totalpay)}</span>
              <span className={styles.th1Text}>{data.voucher === "" ? "-" : data.voucher}</span>
            </div>
          </div>
        </div>
        <div className={styles.contentFooter}>
          <div className={styles.summaryLabel}>
            <div className={styles.th1Textwrap}>
              <b className={styles.headerOutlet}>Total Bayar</b>
            </div>
          </div>
          <div className={styles.summaryValue}>
            <div className={styles.th1Textwrap}>
              <b className={styles.headerOutlet}>{newPrice(data.totalpay)}</b>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.paymentInfo}>
        <div className={styles.paymentView}>
          <div className={styles.summaryLabel}>
            <div className={styles.labelWrap}>
              <span className={styles.headerOutlet}>Metode Pembayaran</span>
              <span className={styles.headerOutlet}>Status Pembayaran</span>
            </div>
          </div>
          <div className={styles.paymentValue}>
            <div className={styles.labelWrap}>
              <span className={styles.th1Text}>{data.payment === "" ? "Not set" : data.payment}</span>
              <span className={styles.th1Text}>{invoiceAlias(data.transactionstatus)}</span>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const Invoice = forwardRef(({ data, items }, ref) => (
  <div ref={ref} className={styles.canvas}>
    <main className={styles.view}>
      <InvoiceContent data={data} items={items} />
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.th1Text}>Terimakasih sudah menggunakan layanan Edental!</span>
          <span className={styles.leftDesc}>Hubungi kami jika terdapat kendala pada invoice/pembayaran.</span>
        </div>
        <div className={styles.footerRight}>
          <span className={styles.headerOutlet}>+62 8128 8364 747</span>
          <span className={styles.headerOutlet}>support@edental.id</span>
          <span className={styles.headerOutlet}>© PT. Bangun Senyum Indonesia</span>
        </div>
      </footer>
    </main>
  </div>
));

export default Invoice;
