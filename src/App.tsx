import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "./components/EmptyState";
import { ErrorState } from "./components/ErrorState";
import { Layout } from "./components/Layout";
import { LoadingState } from "./components/LoadingState";
import { AlgorithmPurchasePage } from "./components/AlgorithmPurchasePage";
import { DemandElasticityPage } from "./components/DemandElasticityPage";
import { ServiceSelector } from "./components/ServiceSelector";
import { SkuBudgetPage } from "./components/SkuBudgetPage";
import type {
  AlgorithmPurchaseData,
  DemandElasticityData,
  ServiceId,
  ServiceSummary,
  SkuBudgetData
} from "./types";

type LoadState<T> =
  | { status: "idle" | "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: T };

const serviceDataUrls: Record<ServiceId, string> = {
  algorithm: "/data/algorithm-purchase.json",
  "demand-elasticity": "/data/demand-elasticity.json",
  "sku-budget": "/data/sku-budget.json"
};

function getRoute(): ServiceId | "home" {
  const slug = window.location.pathname.replace(/^\/+|\/+$/g, "");

  if (!slug) {
    return "home";
  }

  if (slug === "algorithm" || slug === "demand-elasticity" || slug === "sku-budget") {
    return slug;
  }

  return "home";
}

function useJson<T>(url: string | undefined): LoadState<T> {
  const [state, setState] = useState<LoadState<T>>({ status: "idle" });

  useEffect(() => {
    if (!url) {
      setState({ status: "idle" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Не удалось загрузить ${url}: ${response.status}`);
        }

        return response.json() as Promise<T>;
      })
      .then((data) => {
        if (!cancelled) {
          setState({ status: "success", data });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            error:
              error instanceof Error
                ? error.message
                : "Не удалось загрузить данные"
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}

function isAlgorithmData(
  data: AlgorithmPurchaseData | DemandElasticityData | SkuBudgetData
): data is AlgorithmPurchaseData {
  return data.id === "algorithm" && "algorithms" in data;
}

function isDemandElasticityData(
  data: AlgorithmPurchaseData | DemandElasticityData | SkuBudgetData
): data is DemandElasticityData {
  return data.id === "demand-elasticity" && "categories" in data;
}

function isSkuBudgetData(
  data: AlgorithmPurchaseData | DemandElasticityData | SkuBudgetData
): data is SkuBudgetData {
  return data.id === "sku-budget" && "skus" in data;
}

export default function App() {
  const [route, setRoute] = useState<ServiceId | "home">(getRoute);
  const servicesState = useJson<ServiceSummary[]>("/data/services.json");
  const serviceDataState = useJson<
    AlgorithmPurchaseData | DemandElasticityData | SkuBudgetData
  >(route === "home" ? undefined : serviceDataUrls[route]);

  useEffect(() => {
    const onPopState = () => setRoute(getRoute());
    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState(null, "", path);
    setRoute(getRoute());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const services = servicesState.status === "success" ? servicesState.data : [];
  const currentService = useMemo(
    () => services.find((service) => service.id === route),
    [route, services]
  );

  if (servicesState.status === "loading" || servicesState.status === "idle") {
    return (
      <Layout onNavigate={navigate}>
        <LoadingState label="Готовим материалы EcomPilot" />
      </Layout>
    );
  }

  if (servicesState.status === "error") {
    return (
      <Layout onNavigate={navigate}>
        <ErrorState
          title="Не удалось открыть список сервисов"
          message={servicesState.error}
        />
      </Layout>
    );
  }

  if (route === "home") {
    return (
      <Layout onNavigate={navigate}>
        <ServiceSelector services={services} onNavigate={navigate} />
      </Layout>
    );
  }

  if (!currentService) {
    return (
      <Layout onNavigate={navigate}>
        <EmptyState
          title="Раздел не найден"
          description="Вернитесь к списку сервисов и выберите доступный материал."
          actionLabel="Назад к сервисам"
          onAction={() => navigate("/")}
        />
      </Layout>
    );
  }

  if (serviceDataState.status === "loading" || serviceDataState.status === "idle") {
    return (
      <Layout onNavigate={navigate}>
        <LoadingState label={`Загружаем ${currentService.title}`} />
      </Layout>
    );
  }

  if (serviceDataState.status === "error") {
    return (
      <Layout onNavigate={navigate}>
        <ErrorState
          title={`Не удалось открыть ${currentService.title}`}
          message={serviceDataState.error}
        />
      </Layout>
    );
  }

  if (serviceDataState.status === "success") {
    if (route === "algorithm" && isAlgorithmData(serviceDataState.data)) {
      return (
        <Layout onNavigate={navigate}>
          <AlgorithmPurchasePage
            data={serviceDataState.data}
            onNavigate={navigate}
          />
        </Layout>
      );
    }

    if (
      route === "demand-elasticity" &&
      isDemandElasticityData(serviceDataState.data)
    ) {
      return (
        <Layout onNavigate={navigate}>
          <DemandElasticityPage
            data={serviceDataState.data}
            onNavigate={navigate}
          />
        </Layout>
      );
    }

    if (route === "sku-budget" && isSkuBudgetData(serviceDataState.data)) {
      return (
        <Layout onNavigate={navigate}>
          <SkuBudgetPage
            service={currentService}
            data={serviceDataState.data}
            onNavigate={navigate}
          />
        </Layout>
      );
    }
  }

  return (
    <Layout onNavigate={navigate}>
      <EmptyState
        title="Данные раздела пока не готовы"
        description="Файл данных найден, но его структура не совпала с ожидаемой."
        actionLabel="Назад к сервисам"
        onAction={() => navigate("/")}
      />
    </Layout>
  );
}
