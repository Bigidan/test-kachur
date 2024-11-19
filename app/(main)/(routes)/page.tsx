import HeroSection from "@/components/ui/main/hero-section";
import InfiniteImageScroll from "@/components/ui/main/infinite-image";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import HeadTitle from "@/components/ui/main/head-title";


export default function Home() {
  return (
      <div>
          <div className="hero h-full w-full overflow-hidden flex">
              <HeroSection />
          </div>
          <div className="hero">

              <div className="mx-auto max-w-screen-xl flex my-5">
                  <HeadTitle text="наші" highlight="проєкти" />
              </div>


              <InfiniteImageScroll images={Array.from({length: 18}, (_, i) => `/infinite/${i + 1}.png`)}/>
              <div className="mx-auto max-w-screen-xl flex flex-col justify-center py-10">
                  <div className="flex w-full h-auto bg-accent items-center rounded-md px-3">
                      <Search/>
                      <Input placeholder="Пошук"
                             className="bg-transparent border-transparent outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
                      <Button variant="ghost" size="icon">
                          <SlidersHorizontal/>
                      </Button>
                  </div>
              </div>

              <div className="mx-auto max-w-screen-xl flex flex-row justify-stretch py-10 h-fit">
                  <div className="grid grid-cols-6 grid-rows-2 w-full gap-16">
                      <div className="col-span-2 row-span-2">
                          <Skeleton className="w-full h-[600px]"/>
                      </div>

                      <div className="col-start-3 row-start-1 flex flex-col gap-2">
                          <Skeleton className="w-full h-full"/>
                          <Skeleton className="w-full h-[17px]"/>
                          <Skeleton className="w-full h-[17px]"/>
                      </div>

                      <div className="col-start-4 row-start-1 flex flex-col gap-2">
                          <Skeleton className="w-full h-full"/>
                          <Skeleton className="w-full h-[17px]"/>
                          <Skeleton className="w-full h-[17px]"/>
                      </div>

                      <div className="col-start-5 row-start-1 flex flex-col gap-2">
                          <Skeleton className="w-full h-full"/>
                          <Skeleton className="w-full h-[17px]"/>
                          <Skeleton className="w-full h-[17px]"/>
                      </div>

                      <div className="col-start-6 row-start-1 flex flex-col gap-2">
                          <Skeleton className="w-full h-full"/>
                          <Skeleton className="w-full h-[17px]"/>
                          <Skeleton className="w-full h-[17px]"/>
                      </div>




                      <div className="col-start-3 row-start-2 flex flex-col gap-2">
                          <Skeleton className="w-full h-full"/>
                          <Skeleton className="w-full h-[17px]"/>
                          <Skeleton className="w-full h-[17px]"/>
                      </div>

                      <div className="col-start-4 row-start-2 flex flex-col gap-2">
                          <Skeleton className="w-full h-full"/>
                          <Skeleton className="w-full h-[17px]"/>
                          <Skeleton className="w-full h-[17px]"/>
                      </div>

                      <div className="col-start-5 row-start-2 flex flex-col gap-2">
                          <Skeleton className="w-full h-full"/>
                          <Skeleton className="w-full h-[17px]"/>
                          <Skeleton className="w-full h-[17px]"/>
                      </div>

                      <div className="col-start-6 row-start-2 flex flex-col gap-2">
                          <Skeleton className="w-full h-full"/>
                          <Skeleton className="w-full h-[17px]"/>
                          <Skeleton className="w-full h-[17px]"/>
                      </div>

                  </div>
              </div>

          </div>
      </div>
  );
}
