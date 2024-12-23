import Image from "next/image";
import { Badge } from "../../shadcn/Badge";
import SendmessageIcon from "../../lottie-ui/send-message";
import CardWrapper from "../card-wrapper";

const JourneyGenie = () => {
  return (
    <CardWrapper>
      <div className="relative h-full flex flex-col justify-center gap-6 py-4 sm:py-6 px-4 sm:px-8 overflow-hidden">
        <div className="relative flex justify-between w-full h-full items-stretch flex-col">
          <div className="absolute h-full w-full aspect-[578/433] shadow-2xl rounded-lg">
            <Image
              src={"/projects/JG.jpg"}
              alt={"Station landing page example"}
              fill
              style={{
                objectFit: "cover",
                objectPosition: "top",
                borderRadius: "8px"
              }}
            />
          </div>
        </div>
        <div className="flex flex-col items-start gap-1">
          <h4 className="text-xs font-medium opacity-80 uppercase flex flex-wrap gap-2 items-center">
            <span>Project at</span>
            <span className="flex gap-1">
              <Image
                src="/companies/SFU-block-logo.svg.png"
                alt="SFU logo"
                height={20}
                width={32}
              />
              Simon Fraser University
            </span>
          </h4>
          <div className="w-full flex gap-2 items-center">
            <h1 className="text-2xl font-medium dark:text-white text-black uppercase opacity-90">
              Journey Genie
            </h1>
            <SendmessageIcon link="https://github.com/faa35/journey-genie" lottieName="StationSetupIcon" />
          </div>
          <div className="flex gap-2 flex-wrap mt-1">
            <Badge variant="default" className="text-xs">
              Group project
            </Badge>
            <Badge variant="default" className="text-xs">
              HTML
            </Badge>
            <Badge variant="default" className="text-xs">
              Bootstrap
            </Badge>
            <Badge variant="default" className="text-xs">
              JS
            </Badge>
            <Badge variant="default" className="text-xs">
              PostgreSQL
            </Badge>
            <Badge variant="default" className="text-xs">
              Java Spring Boot
            </Badge>
            <Badge variant="default" className="text-xs">
              MockMvc, JUnit
            </Badge>
            <Badge variant="default" className="text-xs">
              Docker
            </Badge>

          </div>
        </div>
      </div>
    </CardWrapper>
  )
}

export default JourneyGenie