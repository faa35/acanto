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
	AllianceDaoCard,
	StationSetupCard,
	AllianceLandingCard,
	StationLandingCard,
	DeveloperLandingCard,
	Footer,
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
					key="station-landing"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "700ms" : "0ms"
					}}
        >
					<BlurFade delay={0.55}>
						<StationLandingCard />
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
					key="station-setup"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "700ms" : "0ms"
					}}
        >
					<BlurFade delay={0.60}>
						<StationSetupCard />
					</BlurFade>
				</div>
				<div
					key="alliance-dao"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "700ms" : "0ms"
					}}
        >
					<BlurFade delay={0.65}>
						<AllianceDaoCard />
					</BlurFade>
				</div>
				<div
					key="alliance-landing"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "700ms" : "0ms"
					}}
        >
					<BlurFade delay={0.70}>
						<AllianceLandingCard />
					</BlurFade>
				</div>
				<div
					key="developer-landing"
					className={cn(styles.itemGrab, styles.item)}
					style={{
						transitionDuration: isMounted ? "700ms" : "0ms"
					}}
        >
					<BlurFade delay={0.75}>
						<DeveloperLandingCard />
					</BlurFade>
				</div>

			</ResponsiveGridLayout>
			<Footer />
		</div>
	);
};

export default Grid;