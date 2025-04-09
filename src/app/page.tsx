import Article from "@/components/articles/article";
import Information from "@/components/articles/information";
import Footer from "@/components/bars/footer";
import Header from "@/components/headers/header";

export default function Home() {
  return (
    <div className="flex justify-center items-center flex-col w-full">
      <Header />
      <Article />
      <Information />
      <Footer />
    </div>
  );
}
