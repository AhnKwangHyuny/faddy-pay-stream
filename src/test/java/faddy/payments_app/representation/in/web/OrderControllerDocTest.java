package faddy.payments_app.representation.in.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.restdocs.RestDocumentationExtension;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@ActiveProfiles("dev")
@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureRestDocs // Use Default Options - http://localhost:8080
@ExtendWith(RestDocumentationExtension.class)
public class OrderControllerDocTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

//    @Test
//    public void newOrder_2XX_CorrectConstraintValue() throws Exception {
//        PurchaseOrder newOrder = new PurchaseOrder(new Orderer("유진호", "010-1234-1234"),
//            List.of(new PurchaseOrderItem(1, UUID.randomUUID(), "농심 짜파게티 4봉", 4500, 1, 4500)));
//
//        String requestJson = objectMapper.writeValueAsString(newOrder);
//        this.mockMvc.perform(RestDocumentationRequestBuilders.post("/order/new")
//                .contentType(MediaType.APPLICATION_JSON)
//                .accept(MediaType.APPLICATION_JSON)
//                .content(requestJson))
//            .andExpect(status().isOk())
//            .andDo(document("CorrectRequestMessage",
//                    PayloadDocumentation.requestFields(
//                        PayloadDocumentation.fieldWithPath("orderer.name").description("주문자명")
//                            .attributes((key("constraint").value("주문자명을 입력 해주세요."))),
//                        PayloadDocumentation.fieldWithPath("orderer.phoneNumber").description("주문자 휴대전화 번호")
//                            .attributes((key("constraint").value("주문자명을 입력 해주세요."))),
//                        PayloadDocumentation.fieldWithPath("newlyOrderedItem[].itemIdx").description("")
//                            .attributes((key("constraint").value("상세 주문 번호"))),
//                        PayloadDocumentation.fieldWithPath("newlyOrderedItem[].productId").description("")
//                            .attributes((key("constraint").value("상품 ID"))),
//                        PayloadDocumentation.fieldWithPath("newlyOrderedItem[].productName").description("")
//                            .attributes((key("constraint").value("상품명"))),
//                        PayloadDocumentation.fieldWithPath("newlyOrderedItem[].price").description("")
//                            .attributes((key("constraint").value("상품 단일 가격"))),
//                        PayloadDocumentation.fieldWithPath("newlyOrderedItem[].quantity").description("")
//                            .attributes((key("constraint").value("주문 수량"))),
//                        PayloadDocumentation.fieldWithPath("newlyOrderedItem[].amounts").description("")
//                            .attributes((key("constraint").value("주문 상품 총 가격(상품 단일 가격 * 주문 수량)")))
//                    )
//                )
//            );
//    }
//
//    @Test
//    public void newOrder_4XX_ConstraintHasValueBlank() throws Exception {
//        PurchaseOrder newOrder = new PurchaseOrder(new Orderer("", "010-1234-1234"),
//            List.of(new PurchaseOrderItem(1, UUID.randomUUID(), "농심 짜파게티 4봉", 4500, 1, 4500)));
//
//        String requestJson = objectMapper.writeValueAsString(newOrder);
//        this.mockMvc.perform(RestDocumentationRequestBuilders.post("/order/new")
//                .contentType(MediaType.APPLICATION_JSON)
//                .accept(MediaType.APPLICATION_JSON)
//                .content(requestJson))
//            .andExpect(status().is4xxClientError())
//            .andExpect(result -> Assertions.assertInstanceOf(MethodArgumentNotValidException.class, result.getResolvedException()))
//            .andExpect(MockMvcResultMatchers.jsonPath("$.status").value("ERROR"))
//            .andDo(document("ConstraintHasValueBlank")
//            );
//    }

}