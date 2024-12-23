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
	// ProjectCard,
	NavBarCard,
	ML_NN_Card,
	JourneyGenie_Card,
	FriendsBook_Card,
	JourneyGeniev2_Card,
	Portfolio_Card,
	Hashmap_Card,
	Footer,
	AiChatButton,

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
			<NavBarCard />
			<AiChatButton />
			<ResponsiveGridLayout
				useCSSTransforms
				className={styles.layout}
				layouts={layouts.projects} // we are using projects from the 
				//D:\Fall 24\my website\personalweb\frontend\src\data\index.tsx file

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
					key="project-card"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "700ms" : "0ms"
					}}
        >
					<BlurFade delay={0.40}>
						<ProjectCard />
					</BlurFade>
				</div> */}

				<div
					key="journey-geniev2"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "700ms" : "0ms"
					}}
        >
					<BlurFade delay={0.55}>
						<JourneyGeniev2_Card />
					</BlurFade>
				</div>
				<div
					key="theme-toggle-2"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "700ms" : "0ms"
					}}
        >
					<BlurFade delay={0.55}>
						<ThemeToggle />
					</BlurFade>
				</div>

				<div
					key="journey-genie"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "700ms" : "0ms"
					}}
        >
					<BlurFade delay={0.60}>
						<JourneyGenie_Card />
					</BlurFade>
				</div>
				<div
					key="ml-nn"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "700ms" : "0ms"
					}}
        >
					<BlurFade delay={0.65}>
						<ML_NN_Card />
					</BlurFade>
				</div>
				<div
					key="friendsbook"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "700ms" : "0ms"
					}}
        >
					<BlurFade delay={0.70}>
						<FriendsBook_Card />
					</BlurFade>
				</div>
				<div
					key="portfolio"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "700ms" : "0ms"
					}}
        >
					<BlurFade delay={0.75}>
						<Portfolio_Card />
					</BlurFade>
				</div>
				<div
					key="hashmap"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "700ms" : "0ms"
					}}
        >
					<BlurFade delay={0.75}>
						<Hashmap_Card />
					</BlurFade>
				</div>

			</ResponsiveGridLayout>
			<Footer />
		</div>
	);
};

export default Grid;