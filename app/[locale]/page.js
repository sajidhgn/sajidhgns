import React, { Fragment } from "react";
import CommonHead from "../../components/commonHead";
import ContactArea from "../../components/ContactArea";
import ExprienceSec from "../../components/Exprience/Exprience";
import Footer from "../../components/footer/Footer";
import Hero from "../../components/hero/hero";
import Navbar from "../../components/Navbar/Navbar";
import About from "../../components/about/about";
import ProjectSection from "../../components/ProjectSection/ProjectSection";
import Scrollbar from "../../components/scrollbar/scrollbar";

const Home=()=>{
  
  return (
    <div id="scrool">
      <CommonHead />
      <Fragment>
        <div className="br-app">
          <Navbar />
          <Hero />
          <About />
          <ExprienceSec />
          <ProjectSection />
          <ContactArea />
          <Footer />
          <Scrollbar />
        </div>
      </Fragment>
    </div>
  );
}

export default Home;