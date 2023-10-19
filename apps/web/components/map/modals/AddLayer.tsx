import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  useTheme,
  Fade,
  Card,
  CardMedia,
  CardContent,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { v4 } from "uuid";
import { Swiper, SwiperSlide } from "swiper/react";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { filterSearch } from "@/lib/utils/helpers";
import { useTranslation } from "@/i18n/client";
import { usePathname } from "next/navigation";

import { useAppDispatch } from "@/hooks/useAppDispatch";

import type { ChangeEvent } from "react";

const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[10],
  padding: `${theme.spacing(3)} ${theme.spacing(5)}`,
  borderRadius: theme.spacing(1),
}));

const AddLayer = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const pathname = usePathname();
  const { t } = useTranslation(pathname.split("/")[1], "maps");

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<string>("");

  const sampleLayersCatalog = [
    {
      image: "https://openmaptiles.org/img/styles/3d.jpg",
      name: "3D map of USA",
      pricing: "free",
      purchased: true,
    },
    {
      image:
        "https://developers.arcgis.com/esri-leaflet/static/style-vector-tiles-9d9b4aaf3ba315613128eea2a4dca291.png",
      name: "Building Types",
      pricing: "$1.99",
      purchased: false,
    },
    {
      image:
        "https://www.caliper.com/graphics/xaadt-maptitude-data.jpg.pagespeed.ic.C5wCdm2l8E.jpg",
      name: "Traffic data Portland",
      pricing: "$3.49",
      purchased: false,
    },
    {
      image: "https://urban-map.com/wp-content/uploads/UM-PM-Cologne-01.jpg",
      name: "Cologne Public Transport",
      pricing: "free",
      purchased: true,
    },
    {
      image:
        "https://venturebeat.com/wp-content/uploads/2023/04/overture-maps.png?w=1200&strip=all",
      name: "3D buildings worldwide",
      pricing: "$25.99",
      purchased: false,
    },
    {
      image:
        "https://www.researchgate.net/publication/299470459/figure/fig1/AS:614309914738714@1523474305977/A-high-detailed-web-based-accessibility-map-visualization-based-on-transportation-network.png",
      name: "30 minute accessibility",
      pricing: "$1.55",
      purchased: true,
    },
  ];

  const sampleMyLayers = [
    {
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWtXOktskwZr2U9Gz0Xid0KGavEY9FB4WY9M3T24qW5E7uuc8_msolhSATkBGtSrpmVeY&usqp=CAU",
      name: "Usa Supermarkets",
      pricing: false,
      purchased: null,
    },
    {
      image:
        "https://www.acprail.com/wp-content/uploads/2018/04/France-map.jpg",
      name: "France train map",
      pricing: false,
      purchased: null,
    },
    {
      image:
        "https://research.perkinswill.com/wp-content/uploads/2016/11/fig8.jpg",
      name: "Healthcare data",
      pricing: false,
      purchased: null,
    },
  ];

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{ width: "100%", marginBottom: theme.spacing(4) }}
      >
        + {t("panels.layers.add_layer")}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Fade in={open}>
          <ModalBox>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            {t("panels.layers.add_new_layer")}
            </Typography>
            <FormControl
              sx={{ width: "100%", marginBottom: theme.spacing(3) }}
              variant="outlined"
              size="small"
            >
              <InputLabel htmlFor="outlined-adornment-password">
              {t("search")}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <Icon
                      iconName={ICON_NAME.SEARCH}
                      fontSize="small"
                      htmlColor={`${theme.palette.secondary.light}aa`}
                    />
                  </InputAdornment>
                }
                value={search}
                onChange={(
                  e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                ) => setSearch(e.target.value)}
                label={t("search")}
              />
            </FormControl>
            {search === "" ? (
              <>
                <Box>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  {t("panels.layers.latest_layers")}
                  </Typography>
                  <Box>
                    <Swiper
                      slidesPerView="auto"
                      spaceBetween={10}
                      pagination={{
                        clickable: true,
                      }}
                      style={{ margin: "0" }}
                    >
                      {sampleMyLayers.map((myLayer) => (
                        <SwiperSlide
                          key={v4()}
                          style={{ width: "fit-content" }}
                        >
                          <Card
                            sx={{
                              width: "130px",
                              backgroundColor: theme.palette.background.default,
                            }}
                          >
                            <CardMedia
                              image={myLayer.image}
                              component="img"
                              sx={{
                                height: 50,
                                transition:
                                  "transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                                transformOrigin: "center center",
                                objectFit: "cover",
                                backgroundSize: "cover",
                              }}
                            />
                            <CardContent sx={{ padding: theme.spacing(2) }}>
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{ mt: 0.5, width: "100px" }}
                                  noWrap={true}
                                >
                                  {myLayer.name}
                                </Typography>
                              </Box>
                              <Button
                                sx={{
                                  padding: `${theme.spacing(0)} ${theme.spacing(
                                    2,
                                  )}`,
                                  fontSize: "10px",
                                }}
                              >
                                {t("panels.layers.apply")}
                              </Button>
                            </CardContent>
                          </Card>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </Box>
                </Box>
                <Box>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  {t("panels.layers.catalogue")}
                  </Typography>
                </Box>
                <Box>
                  <Swiper
                    slidesPerView="auto"
                    spaceBetween={10}
                    pagination={{
                      clickable: true,
                    }}
                    style={{ margin: "0" }}
                  >
                    {sampleLayersCatalog.map((catalogueLayer) => (
                      <SwiperSlide key={v4()} style={{ width: "fit-content" }}>
                        <Card
                          sx={{
                            width: "130px",
                            backgroundColor: theme.palette.background.default,
                          }}
                        >
                          <CardMedia
                            image={catalogueLayer.image}
                            component="img"
                            sx={{
                              height: 50,
                              transition:
                                "transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                              transformOrigin: "center center",
                              objectFit: "cover",
                              backgroundSize: "cover",
                            }}
                          />
                          <CardContent sx={{ padding: theme.spacing(2) }}>
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{ mt: 0.5, width: "100px" }}
                                noWrap={true}
                              >
                                {catalogueLayer.name}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{ fontSize: "12px", opacity: "60%" }}
                              >
                                {catalogueLayer.pricing}
                              </Typography>
                            </Box>
                            {catalogueLayer.pricing === "free" &&
                            catalogueLayer.purchased ? (
                              <Button
                                sx={{
                                  padding: `${theme.spacing(0)} ${theme.spacing(
                                    2,
                                  )}`,
                                  fontSize: "10px",
                                }}
                              >
                                Apply
                              </Button>
                            ) : (
                              <Button
                                sx={{
                                  padding: `${theme.spacing(0)} ${theme.spacing(
                                    2,
                                  )}`,
                                  fontSize: "10px",
                                }}
                              >
                                Purchase & Apply
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              </>
            ) : (
              <Box display="flex" flexWrap="wrap" justifyContent="space-between">
                {filterSearch(
                  [...sampleMyLayers, ...sampleLayersCatalog],
                  "name",
                  search,
                ).map((searchLayer) => (
                  <Card
                    key={v4()}
                    sx={{
                      width: "130px",
                      marginBottom: theme.spacing(5),
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    <CardMedia
                      image={searchLayer.image}
                      component="img"
                      sx={{
                        height: 50,
                        transition:
                          "transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                        transformOrigin: "center center",
                        objectFit: "cover",
                        backgroundSize: "cover",
                      }}
                    />
                    <CardContent sx={{ padding: theme.spacing(2) }}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ mt: 0.5, width: "100px" }}
                          noWrap={true}
                        >
                          {searchLayer.name}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ fontSize: "12px", opacity: "60%" }}
                        >
                          {searchLayer.pricing}
                        </Typography>
                      </Box>
                      {searchLayer.pricing === "free" &&
                      searchLayer.purchased ? (
                        <Button
                          sx={{
                            padding: `${theme.spacing(0)} ${theme.spacing(2)}`,
                            fontSize: "10px",
                          }}
                        >
                          {t("panels.layers.apply")}
                        </Button>
                      ) : (
                        <Button
                          sx={{
                            padding: `${theme.spacing(0)} ${theme.spacing(2)}`,
                            fontSize: "10px",
                          }}
                        >
                          {t("panels.layers.purchase_and_apply")}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
            <Button
              variant="text"
              onClick={() => setOpen(false)}
              sx={{ marginTop: "20px", float: "right" }}
            >
              {t("close")}
            </Button>
          </ModalBox>
        </Fade>
      </Modal>
    </Box>
  );
};

export default AddLayer;
