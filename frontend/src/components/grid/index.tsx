"use client";

import { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./grid.module.scss";
import {
	WidthProvider,
	ResponsiveGridLayout as Responsive,
} from "react-grid-layout-next";
import { heights, layouts } from "@/data";
import ThemeToggle from "../theme-toggle";
import BlurFade from "../magic-ui/blur-fade";
import {
	
	DiscordCard,
	LastfmCard,
	AboutCard,
	MapCard,
	ResumeCard,
	IconCard,
	ChatCard,
	NavBarCard,
	Footer,
	AiChatButton
} from "@/components/cards";

const ResponsiveGridLayout = WidthProvider(Responsive);

const Grid = () => {
	const [height, setHeight] = useState(280);
	const [isMounted, setMounted] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setMounted(true);
		}, 500);
	}, []);

	return (
		<div className={styles.container}>
			{/* Render the Navbar here */}
			<NavBarCard />

			<AiChatButton />

			<ResponsiveGridLayout
				useCSSTransforms
				className={styles.layout}
				layouts={layouts.all}
				breakpoints={{
					lg: 1199,
					md: 799,
					sm: 374,
				}}
				cols={{
					lg: 12,
					md: 10,
					sm: 4,
				}}
				isDraggable={false}
				rowHeight={height}
				margin={[16, 16]} // Horizontal and vertical margin here
				onBreakpointChange={(breakpoint: any) => {
					setHeight(heights[breakpoint])
				}}

			>
				{/* <div
					key="navbar-card"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "500ms" : "0ms",
						height: "100%"
					}}>
					<BlurFade delay={0.05}>
						<NavBarCard />
					</BlurFade>
				</div> */}
				<div
					key="bio"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "500ms" : "0ms",
						height: "100%"
					}}>
					<BlurFade delay={0.01}>
						<AboutCard />
					</BlurFade>
				</div>
				{/* <div
					key="text-marquee"
					className={cn(styles.itemGrab, styles.item, "text-marquee")}
					style={{
						transitionDuration: isMounted ? "500ms" : "0ms"
					}}
				>
					<BlurFade delay={0.04}>
						<TextMarqueeCard />
					</BlurFade>
				</div> */}
				<div
					key="map"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "500ms" : "0ms"
					}}
				>
					<BlurFade delay={0.08}>
						<MapCard />
					</BlurFade>
				</div>
				<div
					key="theme-toggle"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "500ms" : "0ms"
					}}>
					<div className="flex flex-col-reverse sm:flex-col gap-3 h-full">
						<BlurFade delay={0.12}>
							<ThemeToggle />
						</BlurFade>


					</div>
				</div>
				<div
					key="resume"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "500ms" : "0ms"
					}}>
					<div className="flex flex-col-reverse sm:flex-col gap-3 h-full">
						<BlurFade delay={0.1}>
							<ResumeCard />
						</BlurFade>

					</div>
				</div>


				<div
					key="github"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "500ms" : "0ms"
					}}
				>
					<BlurFade delay={0.26}>
						<IconCard title="Github" link="https://github.com/faa35" />
					</BlurFade>
				</div>
				<div
					key="linkedin"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "500ms" : "0ms"
					}}
				>
					<BlurFade delay={0.24}>
						<IconCard title="Linkedin" link="https://www.linkedin.com/in/fardin-abdulla/" />
					</BlurFade>
				</div>

				<div
					key="codepen"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "500ms" : "0ms"
					}}
				>
					<BlurFade delay={0.28}>
						<IconCard title="Codepen" link="https://www.instagram.com/acanto_abdulla/" />
					</BlurFade>
				</div>
				<div
					key="email"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "500ms" : "0ms"
					}}
				>
					<BlurFade delay={0.30}>
						<IconCard title="Email" link="mailto:abdullafardin2202@gmail.com" />
					</BlurFade>
				</div>
				<div
					key="discord"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "500ms" : "0ms"
					}}
				>
					<BlurFade delay={0.35}>
						<DiscordCard />
					</BlurFade>
				</div>
				<div
					key="lastfm"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "700ms" : "0ms"
					}}
				>
					<BlurFade delay={0.40}>
						<LastfmCard />
					</BlurFade>
				</div>
				<div
					key="chat-card"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "700ms" : "0ms"
					}}
				>
					<BlurFade delay={0.40}>
						<ChatCard />
					</BlurFade>
				</div>
				<div
					key="chat-card-2"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "700ms" : "0ms"
					}}
				>
					<BlurFade delay={0.40}>
						<ChatCard />
					</BlurFade>
				</div>

			</ResponsiveGridLayout>
			<Footer />

		</div>
	);
};

export default Grid;
