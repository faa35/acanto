/* eslint-disable @next/next/no-img-element */
import { Fragment } from "react";
import Marquee from "react-fast-marquee";
import CardWrapper from "@/components/cards/card-wrapper";

const TextMarqueeCard = () => {
  return (
    <CardWrapper>
      <div className="flex h-full items-center justify-center px-6 py-4">
        <div className="relative w-full max-w-full h-8 overflow-hidden">
          <Marquee
            speed={90}
            style={{
              maskImage:
                "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 12.5%, rgb(0, 0, 0) 87.5%, rgba(0, 0, 0, 0) 100%)",
              margin: "auto",
            }}
          >
            {/* Scrolling Content */}
            <Fragment>
              {/* Add gap at the start */}
              <span style={{ marginLeft: "48rem" }}></span> {/* Bigger gap */}
              <span className="flex items-center text-2xl gap-2">
                Hey there! 😊{" "}
                <b className="ml-1.5">Want to know more about me?</b>{" "}
                <img src="/star1.svg" alt="Star" className="h-4 w-4 mx-2" />
              </span>
              <span className="flex items-center text-2xl gap-2">
                Take a moment to{" "}
                <b className="ml-1.5">scroll</b> and see what I'm up to—whether
                it's the song I'm currently vibing to on{" "}
                <b className="ml-1.5">Spotify</b>, or my latest activity on{" "}
                <b className="ml-1.5">Discord</b> in real time.{" "}
                <img src="/star1.svg" alt="Star" className="h-4 w-4 mx-2" />
              </span>
              <span className="flex items-center text-2xl gap-2">
                I hope you're having an amazing day and{" "}
                <b className="ml-1.5">Thank you for stopping by!</b>{" "}
                <img src="/star1.svg" alt="Star" className="h-4 w-4 mx-2" />
              </span>
              {/* Add gap at the end */}
              {/* <span className="ml-64"></span>  */}
            </Fragment>
          </Marquee>
        </div>
      </div>
    </CardWrapper>
  );
};

export default TextMarqueeCard;
