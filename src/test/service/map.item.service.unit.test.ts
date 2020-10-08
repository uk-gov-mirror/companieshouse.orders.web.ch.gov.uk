import { expect } from "chai";

import {
    mapDeliveryDetails, mapDeliveryMethod, mapCertificateType,
    mapIncludedOnCertificate, mapItem
} from "../../service/map.item.service";
import {
    mockCertificateItem, mockCertifiedCopyItem, mockMissingImageDeliveryItem
} from "../__mocks__/order.mocks";

const deliveryDetails = {
    addressLine1: "address line 1",
    addressLine2: "address line 2",
    country: "country",
    forename: "forename",
    locality: "locality",
    postalCode: "postal code",
    region: "region",
    surname: "surname",
    poBox: "po box"
};

describe("map.item.service.unit", () => {
    describe("mapItem", () => {
        it("should return correct data if item is certificate", () => {
            const result = mapItem(mockCertificateItem, deliveryDetails);
            expect(result.serviceUrl).to.equal(`/company/${mockCertificateItem?.companyNumber}/orderable/certificates`);
            expect(result.serviceName).to.equal("Order a certificate");
            expect(result.titleText).to.equal("Certificate ordered");
            expect(result.pageTitle).to.equal("Certificate ordered confirmation");
            expect(result.happensNext).to.equal("We'll prepare the certificate and aim to dispatch it within 4 working days.");
            expect(result.orderDetailsTable).to.not.be.empty;
        });

        it("should return correct data if item is certified copy", () => {
            const result = mapItem(mockCertifiedCopyItem, deliveryDetails);
            expect(result.serviceUrl).to.equal(`/company/${mockCertifiedCopyItem?.companyNumber}/orderable/certified-copies`);
            expect(result.serviceName).to.equal("Order a certified document");
            expect(result.titleText).to.equal("Certified document order confirmed");
            expect(result.pageTitle).to.equal("Certified document order confirmation");
            expect(result.happensNext).to.equal("We'll prepare your order and aim to dispatch it within 4 working days.");
            expect(result.orderDetailsTable).to.not.be.empty;
            expect(result.filingHistoryDocuments).to.not.be.empty;
            expect(result.documentDetailsTable).to.not.be.null;
        });

        it("should return correct data if item is missing image delivery", () => {
            const result = mapItem(mockMissingImageDeliveryItem, deliveryDetails);
            expect(result.serviceUrl).to.equal(`/company/${mockMissingImageDeliveryItem?.companyNumber}/filing-history`);
            expect(result.serviceName).to.equal("Request a document");
            expect(result.titleText).to.equal("Document Requested");
            expect(result.pageTitle).to.equal("Document Requested");
            expect(result.happensNext).to.not.be.empty;
            expect(result.orderDetailsTable).to.not.be.empty;
        });
    });

    describe("mapCertificateType", () => {
        it("maps incorporation-with-all-name-changes to Incorporation with all company name changes", () => {
            const result = mapCertificateType("incorporation-with-all-name-changes");
            expect(result).to.equal("Incorporation with all company name changes");
        });
    });

    describe("mapAddress", () => {
        it("maps full delivery details correctly", () => {
            const deliveryDetails = {
                addressLine1: "address line 1",
                addressLine2: "address line 2",
                country: "country",
                forename: "forename",
                locality: "locality",
                postalCode: "postal code",
                region: "region",
                surname: "surname",
                poBox: "po box"
            };
            const result = mapDeliveryDetails(deliveryDetails);
            expect(result).to.equal("forename surname<br>address line 1<br>address line 2<br>locality<br>region<br>postal code<br>country<br>");
        });
        it("maps full delivery details correctly", () => {
            const deliveryDetails = {
                addressLine1: "address line 1",
                forename: "forename",
                postalCode: "postal code",
                region: "region",
                surname: "surname",
                country: "country",
                locality: "locality"
            };
            const result = mapDeliveryDetails(deliveryDetails);
            expect(result).to.equal("forename surname<br>address line 1<br>locality<br>region<br>postal code<br>country<br>");
        });
    });

    describe("mapDeliveryMethod", () => {
        it("map standard to Standard delivery (dispatched within 4 working days)", () => {
            const result = mapDeliveryMethod({ deliveryTimescale: "standard" });
            expect(result).to.equal("Standard delivery (aim to dispatch within 4 working days)");
        });

        it("maps same-day to Same Day", () => {
            const result = mapDeliveryMethod({ deliveryTimescale: "same-day" });
            expect(result).to.equal("Same Day");
        });
    });

    describe("mapIncludedOnCertificate", () => {
        it("map all included on certificate correctly", () => {
            const itemOptions = {
                directorDetails: {
                    includeBasicInformation: true
                },
                includeCompanyObjectsInformation: true,
                includeGoodStandingInformation: true,
                registeredOfficeAddressDetails: {
                    includeAddressRecordsType: "current"
                },
                secretaryDetails: {
                    includeBasicInformation: true
                }
            };
            const result = mapIncludedOnCertificate(itemOptions);
            expect(result).to.equal("Statement of good standing<br/>Registered office address<br/>Directors<br/>Secretaries<br/>Company objects");
        });

        it("map some included on certificate correctly", () => {
            const itemOptions = {
                directorDetails: {
                    includeBasicInformation: false
                },
                includeCompanyObjectsInformation: true,
                includeGoodStandingInformation: false,
                registeredOfficeAddressDetails: {
                    includeAddressRecordsType: ""
                },
                secretaryDetails: {
                    includeBasicInformation: true
                }
            };
            const result = mapIncludedOnCertificate(itemOptions);
            expect(result).to.equal("Secretaries<br/>Company objects");
        });
    });
});
