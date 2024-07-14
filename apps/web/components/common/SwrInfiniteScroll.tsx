import type { ReactNode, Ref } from "react";
import React, { useEffect, useState } from "react";
import type { SWRInfiniteResponse } from "swr/infinite";

type Props<T> = {
  swr: SWRInfiniteResponse<T>;
  children: ReactNode | ((item: T) => React.ReactNode);
  loadingIndicator?: React.ReactNode;
  endingIndicator?: React.ReactNode;
  isReachingEnd: boolean | ((swr: SWRInfiniteResponse<T>) => boolean);
  offset?: number;
};

const useIntersection = <T extends HTMLElement>(): [boolean, Ref<T>] => {
  const [intersecting, setIntersecting] = useState<boolean>(false);
  const [element, setElement] = useState<HTMLElement>();
  useEffect(() => {
    if (!element) return;
    const observer = new IntersectionObserver((entries) => {
      setIntersecting(entries[0]?.isIntersecting);
    });
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [element]);
  return [intersecting, (el) => el && setElement(el)];
};

const InfiniteScroll = <T,>(props: Props<T>): React.ReactElement<Props<T>> => {
  const {
    swr,
    swr: { setSize, data, isValidating },
    children,
    loadingIndicator,
    endingIndicator,
    isReachingEnd,
    offset = 0,
  } = props;

  const [intersecting, ref] = useIntersection<HTMLDivElement>();

  const ending = typeof isReachingEnd === "function" ? isReachingEnd(swr) : isReachingEnd;

  useEffect(() => {
    if (intersecting && !isValidating && !ending) {
      setSize((size) => size + 1);
    }
  }, [intersecting, isValidating, setSize, ending]);

  return (
    <>
      {typeof children === "function" ? data?.map((item) => children(item)) : children}
      <div style={{ position: "relative" }}>
        <div ref={ref} style={{ position: "absolute", top: offset }} />
        {ending ? endingIndicator : loadingIndicator}
      </div>
    </>
  );
};

export default InfiniteScroll;
