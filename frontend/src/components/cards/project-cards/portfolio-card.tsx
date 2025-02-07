import Image from "next/image"
import { Badge } from "../../shadcn/Badge";
import SendmessageIcon from "../../lottie-ui/send-message";
import CardWrapper from "../card-wrapper";

const Portfolio = () => {
  return (
    <CardWrapper>
      <div className="relative h-full flex flex-col justify-center gap-6 py-4 sm:py-6 px-4 sm:px-8 overflow-hidden">
        <div className="relative flex justify-between w-full h-full items-stretch flex-col">
          <div className="absolute h-full w-full aspect-[578/433] shadow-2xl rounded-lg">
            <Image
              src={"/projects/portfolio.png"}
              alt={"Developer landing page example"}
              fill
              style={{
                objectFit: "cover",
                objectPosition: "top",
                borderRadius: "8px"
              }}
            />
          </div>
        </div>
          <div className="flex flex-col items-start">
            <h4 className="text-xs font-medium opacity-80 uppercase flex flex-wrap gap-1 items-center">
              <span>Personal Project </span>
              <span className="flex gap-1">
                <Image
                  src="/companies/YOLO_Badge.png"
                  alt="Yolo Badge"
                  height={40}
                  width={40}
                />
                {/* Simon Fraser University */}
              </span>
              <span className="flex gap-1">
                <Image
                  src="/companies/PullShark.png"
                  alt="YOLO Badge"
                  height={40}
                  width={42}
                />
                   
              </span>
            </h4>
            <div className="w-full flex gap-2 items-center">
              <h1 className="text-2xl font-medium dark:text-white text-black uppercase opacity-90">
                Personal Portfolio
              </h1>
              <SendmessageIcon link="https://github.com/faa35/acanto" lottieName="PortfolioIcon" />
            </div>
            <div className="flex gap-2 flex-wrap mt-1">
              <Badge variant="default" className="text-xs">
                React
              </Badge>
              <Badge variant="default" className="text-xs">
                Next.js
              </Badge>
              <Badge variant="default" className="text-xs">
                Typescript
              </Badge>
              <Badge variant="default" className="text-xs">
                Tailwind CSS
              </Badge>
              <Badge variant="default" className="text-xs">
                Java Spring boot
              </Badge>
              <Badge variant="default" className="text-xs">
                Vercel + Render
              </Badge>
              <Badge variant="default" className="text-xs">
                3 APIs
              </Badge>
            </div>
          </div>
      </div>
    </CardWrapper>
  )
}

export default Portfolio
