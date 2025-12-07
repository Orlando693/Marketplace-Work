package com.troyecto.marketplace.config;

import com.troyecto.marketplace.entities.*;
import com.troyecto.marketplace.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public void run(String... args) throws Exception {
        // Solo ejecutar si no hay datos
        if (userRepository.count() > 0) {
            System.out.println("✅ Database already seeded, skipping...");
            return;
        }

        System.out.println("🌱 Seeding database...");

        // 1. Crear Usuarios
        List<User> users = createUsers();
        System.out.println("✅ Created " + users.size() + " users");

        // 2. Crear Tiendas
        List<Store> stores = createStores(users);
        System.out.println("✅ Created " + stores.size() + " stores");

        // 3. Crear Productos
        List<Product> products = createProducts(stores);
        System.out.println("✅ Created " + products.size() + " products");

        // 4. Crear Órdenes
        List<Order> orders = createOrders(users);
        System.out.println("✅ Created " + orders.size() + " orders");

        // 5. Crear OrderItems
        List<OrderItem> orderItems = createOrderItems(orders, products);
        System.out.println("✅ Created " + orderItems.size() + " order items");

        // 6. Crear Reviews
        List<Review> reviews = createReviews(users, products);
        System.out.println("✅ Created " + reviews.size() + " reviews");

        System.out.println("🎉 Database seeding completed successfully!");
    }

    private List<User> createUsers() {
        List<User> users = new ArrayList<>();

        User user1 = User.builder()
                .firstName("Carlos")
                .lastName("García")
                .email("carlos.garcia@example.com")
                .phone("71234567")
                .address("Av. Arce 2345, La Paz, Bolivia")
                .role("ROLE_USER")
                .build();

        User user2 = User.builder()
                .firstName("María")
                .lastName("López")
                .email("maria.lopez@example.com")
                .phone("72345678")
                .address("Calle Comercio 456, Santa Cruz, Bolivia")
                .role("ROLE_USER")
                .build();

        User user3 = User.builder()
                .firstName("Juan")
                .lastName("Martínez")
                .email("juan.martinez@example.com")
                .phone("73456789")
                .address("Av. Ballivián 789, Cochabamba, Bolivia")
                .role("ROLE_ADMIN")
                .build();

        User user4 = User.builder()
                .firstName("Ana")
                .lastName("Rodríguez")
                .email("ana.rodriguez@example.com")
                .phone("74567890")
                .address("Calle Bolívar 321, Sucre, Bolivia")
                .role("ROLE_USER")
                .build();

        User user5 = User.builder()
                .firstName("Luis")
                .lastName("Fernández")
                .email("luis.fernandez@example.com")
                .phone("75678901")
                .address("Av. 6 de Agosto 654, La Paz, Bolivia")
                .role("ROLE_USER")
                .build();

        users.add(user1);
        users.add(user2);
        users.add(user3);
        users.add(user4);
        users.add(user5);

        return userRepository.saveAll(users);
    }

    private List<Store> createStores(List<User> users) {
        List<Store> stores = new ArrayList<>();

        Store store1 = Store.builder()
                .name("Tecnología Total")
                .description("Tu tienda de tecnología de confianza")
                .category("Electronics")
                .isActive(true)
                .user(users.get(0))
                .createdDate(LocalDateTime.now().minusDays(30))
                .build();

        Store store2 = Store.builder()
                .name("Moda y Estilo")
                .description("Las últimas tendencias en moda y accesorios")
                .category("Clothing")
                .isActive(true)
                .user(users.get(1))
                .createdDate(LocalDateTime.now().minusDays(25))
                .build();

        Store store3 = Store.builder()
                .name("Librería El Saber")
                .description("Libros para todos los gustos")
                .category("Books")
                .isActive(true)
                .user(users.get(2))
                .createdDate(LocalDateTime.now().minusDays(20))
                .build();

        Store store4 = Store.builder()
                .name("Hogar Perfecto")
                .description("Todo lo que necesitas para tu hogar")
                .category("Furniture")
                .isActive(true)
                .user(users.get(3))
                .createdDate(LocalDateTime.now().minusDays(15))
                .build();

        stores.add(store1);
        stores.add(store2);
        stores.add(store3);
        stores.add(store4);

        return storeRepository.saveAll(stores);
    }

    private List<Product> createProducts(List<Store> stores) {
        List<Product> products = new ArrayList<>();

        // Productos de Tecnología Total
        products.add(Product.builder()
                .name("iPhone 15 Pro")
                .description("Último smartphone de Apple con chip A17")
                .price(new BigDecimal("999.99"))
                .stock(50)
                .store(stores.get(0))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(10))
                .build());

        products.add(Product.builder()
                .name("Samsung Galaxy S24")
                .description("Teléfono Android insignia con funciones de IA")
                .price(new BigDecimal("899.99"))
                .stock(35)
                .store(stores.get(0))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(8))
                .build());

        products.add(Product.builder()
                .name("MacBook Pro M3")
                .description("Laptop potente para profesionales")
                .price(new BigDecimal("1999.99"))
                .stock(20)
                .store(stores.get(0))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(5))
                .build());

        // Productos de Moda y Estilo
        products.add(Product.builder()
                .name("Chaqueta de Cuero Premium")
                .description("Chaqueta de cuero de calidad superior")
                .price(new BigDecimal("299.99"))
                .stock(15)
                .store(stores.get(1))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(12))
                .build());

        products.add(Product.builder()
                .name("Jeans Casual")
                .description("Jeans cómodos para uso diario")
                .price(new BigDecimal("79.99"))
                .stock(100)
                .store(stores.get(1))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(9))
                .build());

        products.add(Product.builder()
                .name("Vestido de Verano")
                .description("Elegantes vestidos para el verano")
                .price(new BigDecimal("149.99"))
                .stock(45)
                .store(stores.get(1))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(7))
                .build());

        // Productos de Librería El Saber
        products.add(Product.builder()
                .name("Cien Años de Soledad")
                .description("Clásico de la literatura latinoamericana")
                .price(new BigDecimal("24.99"))
                .stock(80)
                .store(stores.get(2))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(15))
                .build());

        products.add(Product.builder()
                .name("Guía de Programación 2024")
                .description("Guía completa de programación moderna")
                .price(new BigDecimal("49.99"))
                .stock(60)
                .store(stores.get(2))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(6))
                .build());

        // Productos de Hogar Perfecto
        products.add(Product.builder()
                .name("Mesa de Centro Moderna")
                .description("Elegante mesa de centro para sala")
                .price(new BigDecimal("399.99"))
                .stock(25)
                .store(stores.get(3))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(11))
                .build());

        products.add(Product.builder()
                .name("Silla Ergonómica de Oficina")
                .description("Silla cómoda para largas jornadas de trabajo")
                .price(new BigDecimal("299.99"))
                .stock(30)
                .store(stores.get(3))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(4))
                .build());

        return productRepository.saveAll(products);
    }

    private List<Order> createOrders(List<User> users) {
        List<Order> orders = new ArrayList<>();

        orders.add(Order.builder()
                .subtotal(999.99)
                .totalAmount(1080)
                .tax(80.00)
                .currency("BOB")
                .payMethod("Visa")
                .paymentStatus("Completado")
                .orderDate(LocalDateTime.now().minusDays(3))
                .user(users.get(0))
                .build());

        orders.add(Order.builder()
                .subtotal(449.98)
                .totalAmount(486)
                .tax(36.00)
                .currency("BOB")
                .payMethod("MasterCard")
                .paymentStatus("Completado")
                .orderDate(LocalDateTime.now().minusDays(2))
                .user(users.get(1))
                .build());

        orders.add(Order.builder()
                .subtotal(299.99)
                .totalAmount(324)
                .tax(24.00)
                .currency("BOB")
                .payMethod("Paypal")
                .paymentStatus("Pendiente")
                .orderDate(LocalDateTime.now().minusDays(1))
                .user(users.get(3))
                .build());

        orders.add(Order.builder()
                .subtotal(149.99)
                .totalAmount(162)
                .tax(12.00)
                .currency("BOB")
                .payMethod("Visa")
                .paymentStatus("Completado")
                .orderDate(LocalDateTime.now().minusHours(12))
                .user(users.get(4))
                .build());

        return orderRepository.saveAll(orders);
    }

    private List<OrderItem> createOrderItems(List<Order> orders, List<Product> products) {
        List<OrderItem> orderItems = new ArrayList<>();

        // Order 1: iPhone
        orderItems.add(OrderItem.builder()
                .quantity(1)
                .price(999.99)
                .subtotal(999.99)
                .order(orders.get(0))
                .product(products.get(0))
                .build());

        // Order 2: Leather Jacket + Jeans
        orderItems.add(OrderItem.builder()
                .quantity(1)
                .price(299.99)
                .subtotal(299.99)
                .order(orders.get(1))
                .product(products.get(3))
                .build());

        orderItems.add(OrderItem.builder()
                .quantity(2)
                .price(79.99)
                .subtotal(159.98)
                .order(orders.get(1))
                .product(products.get(4))
                .build());

        // Order 3: Office Chair
        orderItems.add(OrderItem.builder()
                .quantity(1)
                .price(299.99)
                .subtotal(299.99)
                .order(orders.get(2))
                .product(products.get(9))
                .build());

        // Order 4: Summer Dress
        orderItems.add(OrderItem.builder()
                .quantity(1)
                .price(149.99)
                .subtotal(149.99)
                .order(orders.get(3))
                .product(products.get(5))
                .build());

        return orderItemRepository.saveAll(orderItems);
    }

    private List<Review> createReviews(List<User> users, List<Product> products) {
        List<Review> reviews = new ArrayList<>();

        reviews.add(Review.builder()
                .rating(5)
                .comment("¡Excelente producto! Muy recomendado.")
                .user(users.get(0))
                .product(products.get(0))
                .createdAt(LocalDateTime.now().minusDays(2))
                .updatedAt(LocalDateTime.now().minusDays(2))
                .build());

        reviews.add(Review.builder()
                .rating(4)
                .comment("Buena calidad, envío rápido.")
                .user(users.get(1))
                .product(products.get(1))
                .createdAt(LocalDateTime.now().minusDays(3))
                .updatedAt(LocalDateTime.now().minusDays(3))
                .build());

        reviews.add(Review.builder()
                .rating(5)
                .comment("¡Perfecto! Justo lo que necesitaba.")
                .user(users.get(2))
                .product(products.get(3))
                .createdAt(LocalDateTime.now().minusDays(1))
                .updatedAt(LocalDateTime.now().minusDays(1))
                .build());

        reviews.add(Review.builder()
                .rating(3)
                .comment("Bueno pero un poco caro.")
                .user(users.get(3))
                .product(products.get(5))
                .createdAt(LocalDateTime.now().minusHours(18))
                .updatedAt(LocalDateTime.now().minusHours(18))
                .build());

        reviews.add(Review.builder()
                .rating(5)
                .comment("¡Increíble calidad y comodidad!")
                .user(users.get(4))
                .product(products.get(9))
                .createdAt(LocalDateTime.now().minusHours(6))
                .updatedAt(LocalDateTime.now().minusHours(6))
                .build());

        reviews.add(Review.builder()
                .rating(4)
                .comment("Muy buen libro, disfruté mucho leyéndolo.")
                .user(users.get(0))
                .product(products.get(6))
                .createdAt(LocalDateTime.now().minusDays(4))
                .updatedAt(LocalDateTime.now().minusDays(4))
                .build());

        return reviewRepository.saveAll(reviews);
    }
}
